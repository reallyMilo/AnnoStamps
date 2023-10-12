import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

type Response = {
  message: string | unknown
  ok: boolean
}

type FieldInput = Pick<
  Prisma.StampUncheckedCreateInput,
  'category' | 'region' | 'description' | 'title' | 'modded' | 'collection'
> & { filePath: string; imagePaths: string[] | string }

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
    const { filePath, imagePaths, ...fields }: FieldInput = req.body

    const images =
      typeof imagePaths === 'string'
        ? [{ originalUrl: imagePaths }]
        : imagePaths.map((image) => ({
            originalUrl: image,
          }))

    const createStamp = await prisma.stamp.create({
      data: {
        userId: session.user.id,
        game: '1800',
        stampFileUrl: filePath,
        images: {
          create: images,
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
