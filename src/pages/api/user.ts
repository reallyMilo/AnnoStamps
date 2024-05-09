import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/auth'
import { userIncludeStatement, UserWithStamps } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

type Response = {
  data?: Partial<UserWithStamps>
  message: string
}

export default async function usernameHandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await auth(req, res)

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
      return res.status(200).json({ message: 'user stamps', data: user })
    } catch (e) {
      return res.status(500).json({ message: 'zod/prisma/server error' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { username, biography } = req.body

      const updateData = session.user.username
        ? { biography }
        : {
            username,
            usernameURL: username.toLowerCase(),
            biography,
          }

      await prisma.user.update({
        data: updateData,
        where: { id: session.user.id },
      })

      return res.status(200).json({ message: 'updated user info' })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return res.status(400).json({ message: 'username already taken.' })
        }
      }
      return res.status(500).json({ message: 'zod/server error' })
    }
  }

  return res
    .status(405)
    .json({ message: `HTTP method ${req.method} is not supported.` })
}
