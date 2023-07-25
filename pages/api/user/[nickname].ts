import { Stamp } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  listedStamps?: Stamp[]
  message?: string
}

export default async function nicknameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const nickname = req.query.nickname as string
  const nicknameSchema = z.string()
  nicknameSchema.parse(req.query.nickname) // throws zod error

  if (req.method === 'GET') {
    const getUserStamps = await prisma.user.findMany({
      select: { listedStamps: true },
      where: { nickname: nickname },
    })

    return res
      .status(200)
      .json({ listedStamps: getUserStamps[0]?.listedStamps })
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
