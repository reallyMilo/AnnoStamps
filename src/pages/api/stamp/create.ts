import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/auth'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'
import prisma from '@/lib/prisma/singleton'

type Response = {
  message: string | unknown
  ok: boolean
}

type FieldInput = Pick<
  Prisma.StampUncheckedCreateInput,
  | 'category'
  | 'region'
  | 'unsafeDescription'
  | 'title'
  | 'modded'
  | 'collection'
  | 'stampFileUrl'
> & { addImages: string[]; stampId: string }

export default async function createStampHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  const session = await auth(req, res)

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }
  if (!session.user.usernameURL) {
    return res.status(400).json({ ok: false, message: 'UsernameURL not set' })
  }

  try {
    const {
      addImages,
      stampId,
      stampFileUrl,
      unsafeDescription,
      ...fields
    }: FieldInput = req.body
    const sanitizedMarkdown = parseAndSanitizedMarkdown(unsafeDescription)
    await prisma.stamp.create({
      data: {
        id: stampId,
        userId: session.user.id,
        game: '1800',
        stampFileUrl,
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
        unsafeDescription,
        markdownDescription: sanitizedMarkdown,
        ...fields,
      },
    })
    await res.revalidate(`/${session.user.usernameURL}`)
    return res.status(200).json({ ok: true, message: 'stamp created!' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
