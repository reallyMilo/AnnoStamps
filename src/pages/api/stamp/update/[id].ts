import type { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/auth'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'
import prisma from '@/lib/prisma/singleton'

interface Req extends NextApiRequest {
  body: Pick<
    Prisma.StampUncheckedCreateInput,
    | 'category'
    | 'region'
    | 'unsafeDescription'
    | 'title'
    | 'modded'
    | 'stampFileUrl'
  > & { addImages: string[]; deleteImages: string[] }
  query: {
    id: string
  }
}

export default async function updateStampHandler(
  req: Req,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }
  const { id: stampId } = req.query
  const { addImages, deleteImages, unsafeDescription, ...fields } = req.body

  const session = await auth(req, res)

  if (!session?.user.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }
  if (!session.user.usernameURL) {
    return res.status(400).json({ ok: false, message: 'UsernameURL not set' })
  }

  try {
    const markdownDescription = parseAndSanitizedMarkdown(unsafeDescription)
    await prisma.$transaction(async (tx) => {
      const userStamp = await tx.user.findUnique({
        select: {
          listedStamps: {
            where: {
              id: stampId,
            },
          },
        },
        where: {
          id: session.user.id,
        },
      })
      if (userStamp?.listedStamps.length === 0) {
        throw new Error('Not stamp owner')
      }

      if (deleteImages.length > 0) {
        await tx.image.deleteMany({
          where: {
            id: {
              in: deleteImages,
            },
          },
        })
      }

      return await tx.stamp.update({
        where: {
          id: stampId,
        },
        data: {
          ...(addImages.length > 0 && {
            images: {
              create: addImages.map((image) => {
                const start = image.lastIndexOf('/')
                const end = image.lastIndexOf('.')
                const id = image.slice(start + 1, end)
                return {
                  id,
                  originalUrl: image,
                }
              }),
            },
          }),
          changedAt: new Date().toISOString(),
          unsafeDescription,
          markdownDescription,
          ...fields,
        },
      })
    })
    await res.revalidate(`/stamp/${stampId}`)
    await res.revalidate(`/${session.user.usernameURL}`)
    return res.status(200).json({ ok: true, message: 'successfully updated' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
