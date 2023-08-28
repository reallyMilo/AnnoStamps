//TODO: Refactor on new image uploading procedure, compression, s3 bucket etc...

import { createClient } from '@supabase/supabase-js'
import { decode } from 'base64-arraybuffer'
import { Category, Region1800 } from 'game/1800/enum'
import type { CreateStamp1800 } from 'game/1800/types'
import { prisma } from 'lib/prisma'
import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  message: string
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
export default async function addStampHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }

  const createStampSchema = z
    .object({
      title: z.string(),
      description: z.string(),
      category: z.nativeEnum(Category),
      region: z.nativeEnum(Region1800),
      good: z.string(),
      capital: z.string(),
      townhall: z.boolean(),
      tradeUnion: z.boolean(),
      modded: z.boolean(),
      image: z.string(),
      stamp: z.string(),
    })
    .safeParse(JSON.parse(req.body))

  if (!createStampSchema.success) {
    return res.status(400).json({ message: 'Invalid Data' })
  }
  const { image, stamp, ...createStampFields } = createStampSchema.data
  const imageType = image.match(/data:(.*);base64/)?.[1]
  const base64Image = image.split('base64,')?.[1]
  const stampFileType = stamp.match(
    /data:application(\/)octet-stream;base64/
  )?.[1]
  const base64StampFile = stamp.split('base64,')?.[1]
  if (!imageType || !base64Image) {
    return res.status(500).json({ message: 'Image data not valid' })
  }
  if (!stampFileType || !base64StampFile) {
    return res.status(500).json({ message: 'No stamp file' })
  }

  const imageId = nanoid()
  const imageExt = imageType.split('/')[1]
  const imagePath = `${imageId}.${imageExt}`
  const stampId = nanoid()
  const stampPath = `${stampId}`

  if (process.env.NODE_ENV === 'development') {
    const [, stampError] = await createStamp(session.user.id, {
      ...createStampFields,
      game: '1800',
      imageUrl: '/uploaded.png',
      stampFileUrl: 'no-stamp',
    })
    if (stampError) {
      return res.status(500).json({ message: 'error creating stamp' })
    }

    return res.status(200).json({ message: 'Check prisma studio for upload' })
  }

  if (
    !process.env.SUPABASE_SCREENSHOTS ||
    !process.env.SUPABASE_STAMPS ||
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_KEY
  ) {
    return res.status(500).json({ message: 'set your supabase keys' })
  }
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )
  const [imageUpload, stampUpload] = await Promise.all([
    supabase.storage
      .from(process.env.SUPABASE_SCREENSHOTS)
      .upload(imagePath, decode(base64Image), {
        contentType: imageType,
        upsert: true,
      }),
    supabase.storage
      .from(process.env.SUPABASE_STAMPS)
      .upload(stampPath, decode(base64StampFile), {
        upsert: true,
        contentType: 'application/octet-stream',
      }),
  ])

  if (imageUpload.error || stampUpload.error) {
    return res
      .status(500)
      .json({ message: 'enable to upload stamp or image to supabase' })
  }

  const imageUrl = `${process.env.SUPABASE_URL.replace(
    '.co',
    '.in'
  )}/storage/v1/object/public/${process.env.SUPABASE_SCREENSHOTS}/${
    imageUpload.data.path
  }`

  const stampFileUrl = `${process.env.SUPABASE_URL.replace(
    '.co',
    '.in'
  )}/storage/v1/object/public/${process.env.SUPABASE_STAMPS}/${
    stampUpload.data.path
  }`

  const [, stampError] = await createStamp(session.user.id, {
    ...createStampFields,
    imageUrl,
    stampFileUrl,
    game: '1800',
  })

  if (stampError) {
    return res.status(500).json({ message: 'error creating stamp' })
  }

  res.status(200).json({ message: 'Stamp uploaded successfully!' })
}

const createStamp = async (
  userId: string,
  insert: Omit<CreateStamp1800, 'user'>
) => {
  try {
    const stamp = await prisma.stamp.create({
      data: {
        userId,
        ...insert,
      },
    })
    return [stamp, null]
  } catch (e) {
    return [null, e]
  }
}
