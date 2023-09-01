import { User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { prisma } from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

type ResponseData = {
  message?: string
  user?: Partial<User>
}

export default async function usernameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const queryUsername = z.string().parse(req.query.username)

  if (req.method === 'GET') {
    try {
      const getUserStamps = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          usernameURL: true,
          image: true,
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
        where: { usernameURL: queryUsername.toLowerCase() },
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

    if (!session?.user.id) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const formData = z
      .object({
        username: z.string().regex(/^[a-zA-Z0-9_\\-]+$/),
        biography: z.string().optional(),
        emailContact: z.string().optional(),
        discord: z.string().optional(),
        twitter: z.string().optional(),
        reddit: z.string().optional(),
        twitch: z.string().optional(),
      })
      .parse(req.body)

    try {
      const updateUserSettings = await prisma.user.update({
        select: {
          username: true,
          usernameURL: true,
          biography: true,
          discord: true,
          emailContact: true,
          twitch: true,
          twitter: true,
          reddit: true,
        },
        where: { id: session.user.id },
        data: {
          ...(session.user.username
            ? {}
            : {
                username: formData.username,
                usernameURL: formData.username.toLowerCase(),
              }),

          ...formData,
        },
      })
      return res.status(200).json({ user: updateUserSettings })
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
