import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

interface Req extends NextApiRequest {
  body: Pick<
    Prisma.StampUncheckedCreateInput,
    | 'category'
    | 'region'
    | 'description'
    | 'title'
    | 'modded'
    | 'collection'
    | 'stampFileUrl'
    | 'id'
  > & { addImages: string[]; deleteImages: string[] }
}

export default async function updateStampHandler(
  req: Req,
  res: NextApiResponse
) {
  const { id: stampId, addImages, deleteImages, ...fields } = req.body

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  if (deleteImages.length > 0) {
    try {
      await prisma.image.deleteMany({
        where: {
          id: {
            in: deleteImages,
          },
        },
      })
    } catch (e) {
      return res
        .status(500)
        .json({ ok: false, message: 'error deleting images' })
    }
  }

  try {
    await prisma.stamp.update({
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
        ...fields,
      },
    })

    return res.status(200).json({ ok: true, message: 'successfully updated' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
