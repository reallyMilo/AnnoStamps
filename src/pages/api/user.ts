import { User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

import { authOptions } from './auth/[...nextauth]'

type ResponseData =
  | {
      message?: string
    }
  | Partial<User>

export default async function usernameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user.id) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        include: userIncludeStatement,
        where: {
          id: session.user.id,
        },
      })

      if (!user) {
        return res.status(404).json({ message: 'No stamps found' })
      }
      return res.status(200).json(user)
    } catch (e) {
      return res.status(500).json({ message: 'zod/prisma/server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { username, ...profile } = req.body

      const updateData = session.user.username
        ? profile
        : {
            username,
            usernameURL: username.toLowerCase(),
            ...profile,
          }
      const user = await prisma.user.update({
        data: updateData,
        where: { id: session.user.id },
      })
      return res.status(200).json(user)
    } catch (e) {
      return res.status(500).json({ message: 'zod/prisma/server error' })
    }
  }

  return res
    .status(405)
    .json({ message: `HTTP method ${req.method} is not supported.` })
}
