import { Prisma, PrismaClient } from '@prisma/client'

import type { FilterState } from '../constants'
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
            filter: Omit<FilterState, 'sort' | 'page'>,
            sort: FilterState['sort'],
            args: Required<Pick<Prisma.StampFindManyArgs, 'take' | 'skip'>>
          ): Promise<[number, StampWithRelations[], number]> {
            return prisma.$transaction(async (q) => {
              const count = await q.stamp.count({
                where: buildFilterWhereClause(filter),
              })

              if (args.skip > count) {
                args.skip = 0
              }

              const stamps = await q.stamp.findMany({
                include: stampIncludeStatement,
                where: buildFilterWhereClause(filter),
                orderBy: buildOrderByClause(sort),
                ...args,
              })

              return [count, stamps, args.skip]
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
  filter: Omit<FilterState, 'sort' | 'page'>
): Prisma.StampWhereInput => {
  const { modded, capital, region, category, townhall, tradeunion, search } =
    filter

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
    ...(townhall ? { townhall: true } : {}),
    //FIXME: TS function return not showing type error for invalid schema where option ie. { tradeunion: true }
    ...(tradeunion ? { tradeUnion: true } : {}),
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
  orderBy?: FilterState['sort']
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
