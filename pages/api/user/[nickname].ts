import { Stamp } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  listedStamps?: Stamp[]
  message?: string
  nickname?: string
}

export default async function nicknameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const nickname = z.string().parse(req.query.nickname)

  if (req.method === 'GET') {
    const getUserStamps = await prisma.user.findMany({
      select: { nickname: true, listedStamps: true },
      where: { nicknameURL: nickname.toLowerCase() },
    })

    return res.status(200).json({
      nickname: getUserStamps[0]?.nickname as string,
      listedStamps: getUserStamps[0]?.listedStamps,
    })
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
