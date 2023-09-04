import { Prisma } from '@prisma/client'
import z from 'zod'

import { filterSchema } from '../hooks/useFilter'
import {
  buildFilterWhereClause,
  buildOrderByClause,
  stampsPerPage,
} from '../utils'
import prisma from './singleton'

//TODO: prisma extensions, and error handling

type GetStampsAndCountProps = z.infer<typeof filterSchema>
export const getStampsAndCount = async (query: GetStampsAndCountProps) => {
  const { page, sort, ...filter } = filterSchema.parse(query)

  const pageNumber = parseInt(page || '1', 10)

  try {
    const [count, stamps] = await prisma.$transaction([
      prisma.stamp.count({
        where: buildFilterWhereClause(filter),
      }),
      prisma.stamp.findMany({
        select: {
          id: true,
          title: true,
          imageUrl: true,
          category: true,
          region: true,
          modded: true,
          likedBy: {
            select: {
              id: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              usernameURL: true,
              image: true,
            },
          },
        },
        where: buildFilterWhereClause(filter),

        orderBy: buildOrderByClause(sort),
        skip: (pageNumber - 1) * stampsPerPage(),
        take: stampsPerPage(),
      }),
    ])

    return [count, stamps] as const
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === '2002') {
        throw new Error(e.message)
      }
    }
    throw e
  }
}
const getUserStampsSchema = z
  .object({ userId: z.string(), username: z.string(), search: z.string() })
  .partial()
export type GetUserStampsProps = z.infer<typeof getUserStampsSchema>
export const getUserStamps = async (query: GetUserStampsProps) => {
  const { userId, username } = getUserStampsSchema.parse(query)

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
          select: {
            id: true,
            title: true,
            imageUrl: true,
            category: true,
            region: true,
            modded: true,
            likedBy: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        ...(username ? { usernameURL: username.toLowerCase() } : {}),
        ...(userId ? { id: userId } : {}),
      },
    })

    if (!getUserStamps) {
      return null
    }
    return getUserStamps
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === '2002') {
        throw new Error(e.message)
      }
    }
    throw e
  }
}
