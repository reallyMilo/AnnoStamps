import { User } from '@prisma/client'
import { prisma } from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  message?: string
  user?: Partial<User>
}

export default async function usernameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const username = z.string().parse(req.query.username)

  if (req.method === 'GET') {
    try {
      const getUserStamps = await prisma.user.findUnique({
        select: {
          username: true,
          discord: true,
          reddit: true,
          emailContact: true,
          twitch: true,
          twitter: true,
          biography: true,
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
        where: { usernameURL: username.toLowerCase() },
      })

      if (!getUserStamps) {
        return res.status(404).json({ message: 'User does not exist' })
      }
      return res.status(200).json({
        user: getUserStamps,
      })
    } catch (e) {
      return res.status(500).json({ message: 'prisma error ' })
    }
  }

  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    const formData = z
      .object({
        username: z.string(),
        biography: z.string().optional(),
        emailContact: z.string().optional(),
        discord: z.string().optional(),
        twitter: z.string().optional(),
        reddit: z.string().optional(),
        twitch: z.string().optional(),
      })
      .parse(req.body)

    if (!session?.user.id) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          usernameURL: username.toLowerCase(),
          ...formData,
        },
      })
      return res.status(200).json({ message: 'Updated user username' })
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'failed to updated user username' })
    }
  }

  return res
    .status(405)
    .json({ message: `HTTP method ${req.method} is not supported.` })
}
