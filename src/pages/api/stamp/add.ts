import { Prisma } from '@prisma/client'
import formidable from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma/singleton'
import { generateResponsiveImages } from '@/lib/upload/image-manipulation'
import { firstValues } from '@/lib/utils'

import { authOptions } from '../auth/[...nextauth]'

export const config = {
  api: {
    bodyParser: false,
  },
}

type Response = {
  message: string | unknown
  ok: boolean
}
type FieldInput = Pick<
  Prisma.StampUncheckedCreateInput,
  'category' | 'region' | 'description' | 'title' | 'modded'
>

export default async function addStampHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  const form = formidable({
    keepExtensions: true,
    maxFiles: 20,
    maxFileSize: 1024 * 1024, // 1 MB
    uploadDir: 'public/tmp/',
  })

  try {
    const [fields, files] = await form.parse(req)

    if (!files.images || !files.stamps) {
      return res.status(404).json({ ok: false, message: 'no images or stamps' })
    }

    const images = []
    for (const file of files.images) {
      const responsiveImageUrls = await generateResponsiveImages(file)
      images.push({ originalUrl: file.filepath, ...responsiveImageUrls })
    }
    const keyValueFields = firstValues(fields) as unknown as FieldInput

    const createStamp = await prisma.stamp.create({
      data: {
        userId: session.user.id,
        game: '1800',
        stampFileUrl: '/stamp.zip',
        images: {
          create: images.map((responsiveUrls) => ({
            ...responsiveUrls,
          })),
        },
        ...keyValueFields,
      },
    })
    return res
      .status(200)
      .json({ ok: true, message: 'stamps uploaded to public/tmp' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
