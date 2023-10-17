import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { Image } from '@/lib/prisma/queries'
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
  > & { addImages: Pick<Image, 'originalUrl'>[]; deleteImages: string[] }
  query: {
    update: string
  }
}

export default async function updateStampHandler(
  req: Req,
  res: NextApiResponse
) {
  const { update: stampId } = req.query
  const { addImages, deleteImages, ...fields } = req.body

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
        id: stampId,
        userId: session.user.id,
        game: '1800',
        images: {
          create: addImages.map((image) => image),
        },
        ...fields,
      },
    })

    return res.status(200).json({ ok: true, message: 'successfully updated' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
