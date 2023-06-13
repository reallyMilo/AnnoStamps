import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { prisma } from '@/lib/prisma'

import { authOptions } from './auth/[...nextauth]'
type ResponseData = {
  message: string
}

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

  console.log(req.body)

  res.status(200).json({ message: 'Hello from Next.js!' })
}
