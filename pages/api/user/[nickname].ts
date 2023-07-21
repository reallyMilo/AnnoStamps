import { Stamp } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

type ResponseData = {
  listedStamps?: Stamp[]
  message?: string
}

export default async function nicknameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (typeof req.query.nickname !== 'string') {
    res.status(400).json({ message: 'string only' })
  }
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
  const nickname = req.query.nickname as string
  const nicknameSchema = z.string()
  nicknameSchema.parse(req.query.nickname) // throws zod error

  const getUserStamps = await prisma.user.findMany({
    select: { listedStamps: true },
    where: { nickname: nickname },
  })
  res.status(200).json({ listedStamps: getUserStamps[0].listedStamps })
}
