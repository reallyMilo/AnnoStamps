import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { Image } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

type Response = {
  message: string | unknown
  ok: boolean
}

type FieldInput = Pick<
  Prisma.StampUncheckedCreateInput,
  | 'category'
  | 'region'
  | 'description'
  | 'title'
  | 'modded'
  | 'collection'
  | 'stampFileUrl'
> & { addImages: Pick<Image, 'originalUrl'>[]; stampId: string }

export default async function createStampHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  try {
    const { addImages, stampId, stampFileUrl, ...fields }: FieldInput = req.body

    const createStamp = await prisma.stamp.create({
      data: {
        id: stampId,
        userId: session.user.id,
        game: '1800',
        stampFileUrl,
        images: {
          create: addImages.map((image) => image),
        },
        ...fields,
      },
    })

    return res
      .status(200)
      .json({ ok: true, message: 'stamps uploaded to public/tmp' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
