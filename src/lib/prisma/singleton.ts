import { Prisma, PrismaClient } from '@prisma/client'

import { type QueryParams, STAMPS_PER_PAGE } from '../constants'
import {
  imageExtension,
  stampExtensions,
  stampIncludeStatement,
  type StampWithRelations,
  userExtension,
} from './models'

const prismaClientSingleton = () => {
  return new PrismaClient()
    .$extends(userExtension)
    .$extends(stampExtensions)
    .$extends(imageExtension)
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
  const { capital, category, region, search } = filter

  // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#postgresql
  // increase chance that user search returns something with or matching
  const parsedQuery = search
    ? search.replace(/(\w)\s+(\w)/g, '$1 | $2')
    : undefined

  const buildArrayFiltering = (column: string, params: string | string[]) => {
    if (Array.isArray(params)) {
      return {
        OR: params.map((param) => ({ [column]: param })),
      }
    } else {
      return { [column]: params }
    }
  }

  return {
    ...(region ? buildArrayFiltering('region', region) : {}),
    ...(category ? buildArrayFiltering('category', category) : {}),
    ...(capital ? buildArrayFiltering('capital', capital) : {}),
    ...(parsedQuery
      ? {
          title: {
            search: parsedQuery,
          },
        }
      : {}),
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
