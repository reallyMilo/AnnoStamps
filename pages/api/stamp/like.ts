import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { prisma } from '@/lib/prisma'

import { authOptions } from '../auth/[...nextauth]'

export default async function likesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method === 'POST') {
    const { stampId, userId } = JSON.parse(req.body)
    try {
      const updateStampLikes = await prisma.stamp.update({
        where: { id: stampId },
        include: { likedBy: true },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
      })

      res
        .status(200)
        .json({ stamp: updateStampLikes, message: 'stamp successfully liked' })
    } catch (e) {
      res.status(500).json({ message: 'An error occured' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
