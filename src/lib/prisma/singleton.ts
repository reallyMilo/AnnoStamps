import { Prisma, PrismaClient } from '@prisma/client'

import { QueryParams } from '../hooks/useQueryParams'
import { stampsPerPage } from '../utils'
import {
  imageExtension,
  stampExtensions,
  stampIncludeStatement,
  StampWithRelations,
  userExtension,
} from './queries'

const prismaClientSingleton = () => {
  return new PrismaClient()
    .$extends(userExtension)
    .$extends(stampExtensions)
    .$extends(imageExtension)
    .$extends({
      model: {
        stamp: {
          async filterFindManyWithCount(
            query: QueryParams
          ): Promise<[number, StampWithRelations[], number]> {
            const { page, sort, ...filter } = query
            let pageNumber = parseInt(page ?? '1', 10)

            return prisma.$transaction(async (q) => {
              const count = await q.stamp.count({
                where: buildFilterWhereClause(filter),
              })
              let skip = (pageNumber - 1) * stampsPerPage
              if (skip > count) {
                skip = 0
                pageNumber = 1
              }

              const stamps = await q.stamp.findMany({
                include: stampIncludeStatement,
                where: buildFilterWhereClause(filter),
                orderBy: buildOrderByClause(sort),
                skip,
                take: stampsPerPage,
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
  filter: Omit<QueryParams, 'sort' | 'page'>
): Prisma.StampWhereInput => {
  const { modded, capital, region, category, search } = filter

  // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#postgresql
  // increase chance that user search returns something with or matching
  const parsedQuery = search
    ? search.replace(/(\w)\s+(\w)/g, '$1 | $2')
    : undefined

  return {
    ...(modded ? { modded: true } : {}),
    ...(region ? { region } : {}),
    ...(category ? { category } : {}),
    ...(capital ? { capital } : {}),
    ...(parsedQuery
      ? {
          title: {
            search: parsedQuery,
          },
          description: {
            search: parsedQuery,
          },
        }
      : {}),
  }
}
export const buildOrderByClause = (
  orderBy?: QueryParams['sort']
): Prisma.StampOrderByWithRelationAndSearchRelevanceInput => {
  switch (orderBy) {
    case 'likes':
      return { likedBy: { _count: 'desc' } }
    case 'newest':
      return { createdAt: 'desc' }
    case 'downloads':
      return { downloads: 'desc' }
    default:
      return { downloads: 'desc' }
  }
}
