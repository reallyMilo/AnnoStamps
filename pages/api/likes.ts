import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { prisma } from '@/lib/prisma'

import { authOptions } from './auth/[...nextauth]'

export default async function likesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }
  //FIXME: shouldnt be post, should be [likes] dynamic api route
  if (req.method === 'POST') {
    try {
      const { stampId, userId } = JSON.parse(req.body)

      const updatedPost = await prisma.stamp.update({
        where: { id: stampId },
        data: {
          likedBy: {
            connect: { id: userId },
          },
        },
      })

      res.status(200).json({ message: 'stamp successfully liked' })
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
