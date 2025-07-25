import { Prisma, PrismaClient } from '@prisma/client'

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
  userIncludeStatement,
  type UserWithStamps,
} from './models'

const prismaClientSingleton = () => {
  return new PrismaClient({
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
          async filterFindManyWithCount(
            query: QueryParams,
          ): Promise<[number, StampWithRelations[], number]> {
            const { page, sort, ...filter } = query
            let pageNumber = parseInt(page ?? '1', 10)

            return prisma.$transaction(async (q) => {
              const count = await q.stamp.count({
                where: buildFilterWhereClause(filter),
              })
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

              return [count, stamps, pageNumber]
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

export const buildFilterWhereClause = (
  filter: Omit<QueryParams, 'page' | 'sort'>,
): Prisma.StampWhereInput => {
  const where: Prisma.StampWhereInput = {}
  const { capital, category, game, region, search } = filter

  const buildFieldMatchFilter = (
    column: string,
    params: string | string[] | undefined,
  ) => {
    if (!params) return null
    if (Array.isArray(params)) {
      return {
        OR: params.map((param) => ({ [column]: param })),
      }
    }
    return { [column]: params }
  }

  // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#postgresql
  if (search) {
    where.title = {
      search: search.replace(
        /\s*([^\s]+)\s*/g,
        (_, word, i) => (i ? '|' : '') + word,
      ),
    }
  }

  where.game = game?.match(/^\d+/)?.[0] ?? '117'

  const categoryFilter = buildFieldMatchFilter('category', category)
  const regionFilter = buildFieldMatchFilter('region', region)
  const capitalFilter = buildFieldMatchFilter('capital', capital)

  type FilterObj = { OR: Record<string, string>[] }
  const columnArr = [categoryFilter, regionFilter, capitalFilter].filter(
    (e): e is FilterObj => e !== null && typeof e === 'object' && 'OR' in e,
  )

  if (columnArr.length >= 2) {
    where.AND = columnArr
    return where
  }

  return {
    ...where,
    ...(categoryFilter ?? {}),
    ...(regionFilter ?? {}),
    ...(capitalFilter ?? {}),
  }
}
export const buildOrderByClause = (
  orderBy?: QueryParams['sort'],
): Prisma.StampOrderByWithRelationInput => {
  switch (orderBy) {
    case 'downloads':
      return { downloads: 'desc' }
    case 'likes':
      return { likedBy: { _count: 'desc' } }
    case 'newest':
      return { createdAt: 'desc' }
    default:
      return { downloads: 'desc' }
  }
}
