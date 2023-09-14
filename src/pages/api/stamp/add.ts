import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
export default async function addStampHandler(
  req: NextApiRequest,
  res: NextApiResponse
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

  try {
    await prisma.stamp.create({
      data: {
        userId: session.user.id,
        game: '1800',
        stampFileUrl: 'no-stamp.zip',
        imageUrl: '/stamp-folder-path.jpg',
      },
    })
    return res.status(200).json({ message: 'Stamp uploaded successfully' })
  } catch (e) {
    return res.status(500).json({ message: 'error creating stamp' })
  }
}
