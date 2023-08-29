import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { Category, Region1800 } from '@/lib/game/1800/enum'
import { prisma } from '@/lib/prisma'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  message: string
}

export default async function editStampHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const stampId = req.query.edit as string
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }

  const getStamp = await prisma.stamp.findUnique({
    where: {
      id: stampId,
    },
  })
  if (getStamp?.userId !== session.user.id) {
    return res.status(401).json({ message: 'Not stamp author' })
  }

  const editStampSchema = z
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
    })
    .safeParse(JSON.parse(req.body))

  if (!editStampSchema.success) {
    return res.status(400).json({ message: 'Invalid Data' })
  }

  try {
    await prisma.stamp.update({
      where: {
        id: getStamp.id,
      },
      data: editStampSchema.data,
    })

    res.status(200).json({ message: 'successfully updated' })
  } catch (e) {
    res.status(500).json({ message: 'something went wrong' })
  }
}
