import type { Stamp } from '@prisma/client'
import { decode } from 'base64-arraybuffer'
import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import * as yup from 'yup'

import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

import { authOptions } from './auth/[...nextauth]'
type ResponseData = {
  message: string
}

const stampFieldSchema = yup.object({
  title: yup.string().trim().defined(),
  description: yup.string().trim().defined(),
  category: yup
    .mixed()
    .oneOf(['production', 'female', 'other'] as const)
    .defined(),
  region: yup.string().defined(),
  good: yup.string().trim().default(null),
  capital: yup.string().default(null),
  townhall: yup.boolean().default(false),
  tradeUnion: yup.boolean().default(false),
  modded: yup.boolean().defined(),
  image: yup.string().defined(),
  stamp: yup.string().defined(),
})

export default async function addStampHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
  const validBody = await stampFieldSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

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
  } = validBody

  const contentType = image.match(/data:(.*);base64/)?.[1]
  const base64FileData = image.split('base64,')?.[1]

  if (!contentType || !base64FileData) {
    return res.status(500).json({ message: 'Image data not valid' })
  }

  // Upload image
  const fileName = nanoid()
  const ext = contentType.split('/')[1]
  const path = `${fileName}.${ext}`

  res.status(200).json({ message: 'Hello from Next.js!' })
}
