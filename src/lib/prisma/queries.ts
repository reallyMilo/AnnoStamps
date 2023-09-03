import { Prisma } from '@prisma/client'
import { ParsedUrlQuery } from 'querystring'
import z from 'zod'

import { filterSchema } from '../hooks/useFilter'
import {
  buildFilterWhereClause,
  buildOrderByClause,
  stampsPerPage,
} from '../utils'
import prisma from './singleton'

//TODO: prisma extensions, only way to stop these huge select statements
// which are only necessary because you cannot exclude fields or set private field on schema

export const getStampsAndCount = async (query: ParsedUrlQuery) => {
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
export const getUserStamps = async (query: ParsedUrlQuery) => {
  const { username } = z
    .object({ username: z.string(), search: z.string().optional() })
    .parse(query)

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
      where: buildFilterWhereClause({}, username),
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
