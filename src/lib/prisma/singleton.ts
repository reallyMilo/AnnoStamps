import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '#/client'

import { type QueryParams, STAMPS_PER_PAGE } from '../constants'
import {
  commentExtension,
  imageExtension,
  notificationExtension,
  preferenceExtension,
  stampExtensions,
  stampIncludeStatement,
  type StampWithRelations,
  userExtension,
  type UserWithStamps,
} from './models'
import { buildFilterWhereClause, buildOrderByClause } from './query-builders'

import 'server-only'

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({
    adapter,
    omit: {
      user: {
        email: true,
        emailVerified: true,
        name: true,
      },
    },
  })
    .$extends(userExtension)
    .$extends(stampExtensions)
    .$extends(imageExtension)
    .$extends(commentExtension)
    .$extends(notificationExtension)
    .$extends(preferenceExtension)
    .$extends({
      model: {
        stamp: {
          async filterFindManyWithCount(query: QueryParams): Promise<{
            count: number
            pageNumber: number
            stamps: StampWithRelations[]
          }> {
            const { page, sort, ...filter } = query
            let pageNumber = parseInt(page ?? '1', 10)

            return prisma.$transaction(async (q) => {
              const count = await q.stamp.count({
                where: buildFilterWhereClause(filter),
              })
              if (count === 0) {
                return { count: 0, pageNumber: 1, stamps: [] }
              }
              let skip = (pageNumber - 1) * STAMPS_PER_PAGE
              if (skip > count) {
                skip = 0
                pageNumber = 1
              }
              const stamps = await q.stamp.findMany({
                include: stampIncludeStatement,
                orderBy: buildOrderByClause(sort),
                skip,
                take: STAMPS_PER_PAGE,
                where: buildFilterWhereClause(filter),
              })

              return { count, pageNumber, stamps }
            })
          },
        },
        user: {
          async filterFindManyWithCount(
            query: QueryParams & { user: string },
          ): Promise<{
            count: number
            pageNumber: number
            stamps: UserWithStamps['listedStamps']
            user: null | Omit<UserWithStamps, 'likedStamps' | 'listedStamps'>
          }> {
            const { page, sort, user, ...filter } = query
            let pageNumber = parseInt(page ?? '1', 10)
            return prisma.$transaction(async (q) => {
              const userStampsCount = await q.user.findFirst({
                include: {
                  _count: {
                    select: {
                      listedStamps: {
                        where: buildFilterWhereClause(filter),
                      },
                    },
                  },
                },
                where: {
                  OR: [{ usernameURL: user.toLowerCase() }, { id: user }],
                },
              })
              if (!userStampsCount) {
                return { count: 0, pageNumber: 1, stamps: [], user: null }
              }

              if (userStampsCount._count.listedStamps === 0) {
                return {
                  count: 0,
                  pageNumber: 1,
                  stamps: [],
                  user: userStampsCount,
                }
              }

              let skip = (pageNumber - 1) * STAMPS_PER_PAGE
              const count = userStampsCount._count.listedStamps
              if (skip > count) {
                skip = 0
                pageNumber = 1
              }

              const userStamps = await q.user.findFirstOrThrow({
                include: {
                  listedStamps: {
                    include: {
                      _count: {
                        select: {
                          likedBy: true,
                        },
                      },
                      images: true,
                    },
                    orderBy: buildOrderByClause(sort),
                    skip,
                    take: STAMPS_PER_PAGE,
                    where: buildFilterWhereClause(filter),
                  },
                },
                where: {
                  OR: [{ usernameURL: user.toLowerCase() }, { id: user }],
                },
              })

              const { listedStamps, ...rest } = userStamps
              return {
                count,
                pageNumber,
                stamps: listedStamps,
                user: rest,
              }
            })
          },
        },
      },
    })
}

export type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
