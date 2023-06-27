//TODO: Refactor on new image uploading procedure, compression, s3 bucket etc...

import { User } from '@prisma/client'
import { decode } from 'base64-arraybuffer'
import { Category, Region1800 } from 'game/1800/enum'
import { getGoodCategory } from 'game/1800/helpers'
import type { CreateStamp1800 } from 'game/1800/types'
import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

import { authOptions } from './auth/[...nextauth]'

type ResponseData = {
  message: string
}

const stampSchema = z.object({
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

  if (!session || !session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }

  const safeParse = stampSchema.safeParse(JSON.parse(req.body))
  if (!safeParse.success) {
    return res.status(400).json({ message: 'Invalid Data' })
  }
  const {
    title,
    description,
    category,
    region,
    good,
    capital,
    townhall,
    tradeUnion,
    modded,
    image,
    stamp,
  } = safeParse.data

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
    const [user, userError] = await getUser(session.user.email)

    if (userError || !user) {
      return res.status(500).json({ message: 'error getting user' })
    }

    const [, stampError] = await createStamp(user, {
      ...safeParse.data,
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
    !process.env.SUPABASE_URL
  ) {
    return res.status(500).json({ message: 'set your supabase keys' })
  }

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

  //FIXME: should be pulling userId from user sesssion!
  const insertStamp: Omit<CreateStamp1800, 'user'> = {
    game: '1800' as const,
    category,
    region,
    title,
    description,
    imageUrl,
    good,
    goodCategory: getGoodCategory(good),
    capital,
    townhall,
    tradeUnion,
    modded,
    stampFileUrl,
  }

  const [user, userError] = await getUser(session.user.email)

  if (userError || !user) {
    return res.status(500).json({ message: 'error getting user' })
  }
  const [, stampError] = await createStamp(user, insertStamp)

  if (stampError) {
    return res.status(500).json({ message: 'error creating stamp' })
  }

  res.status(200).json({ message: 'Stamp uploaded successfully!' })
}

//TODO: next-auth callbacks to add userid + nickname to session
const getUser = async (
  email: string
): Promise<[User | null, null | unknown]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    })
    return [user, null]
  } catch (e) {
    return [null, e]
  }
}

const createStamp = async (
  user: User,
  insert: Omit<CreateStamp1800, 'user'>
) => {
  try {
    const stamp = await prisma.stamp.create({
      data: {
        userId: user.id,
        game: insert.game,
        title: insert.title,
        description: insert.description,
        category: insert.category,
        region: insert.region,
        good: insert.good,
        goodCategory: getGoodCategory(insert.good ?? 'none'),
        imageUrl: insert.imageUrl,
        stampFileUrl: insert.stampFileUrl,
        modded: insert.modded,
      },
    })
    return [stamp, null]
  } catch (e) {
    return [null, e]
  }
}
