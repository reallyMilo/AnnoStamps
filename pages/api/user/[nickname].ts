import type { User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { StampWithLikes } from 'types'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  message?: string
  stamps?: StampWithLikes[]
  user?: Partial<User>
}

export default async function nicknameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const nickname = z.string().parse(req.query.nickname)

  if (req.method === 'GET') {
    try {
      const getUserStamps = await prisma.user.findUnique({
        select: {
          image: true,
          nickname: true,
          listedStamps: {
            include: {
              likedBy: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        where: { nicknameURL: nickname.toLowerCase() },
      })
      if (!getUserStamps) {
        return res.status(200).json({ message: 'no user found' })
      }

      const { listedStamps, ...user } = getUserStamps

      return res.status(200).json({
        user,
        stamps: listedStamps,
      })
    } catch (e) {
      return res.status(500).json({ message: 'prisma error ' })
    }
  }

  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user.id) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          nickname: nickname,
          nicknameURL: nickname.toLowerCase(),
        },
      })
      return res.status(200).json({ message: 'Updated user nickname' })
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'failed to updated user nickname' })
    }
  }

  return res
    .status(405)
    .json({ message: `HTTP method ${req.method} is not supported.` })
}
