import { Prisma, PrismaClient } from '@prisma/client'

import { FilterState } from '../hooks/useFilter'
import { parseBoolean } from '../utils'
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
            args?: Required<Pick<Prisma.StampFindManyArgs, 'take' | 'skip'>>
          ): Promise<[number, StampWithRelations[]]> {
            return prisma.$transaction(async (q) => {
              const count = await q.stamp.count({
                where: buildFilterWhereClause(filter),
              })

              if (args?.skip) {
                const { skip } = args

                if (skip >= count) {
                  args.skip = 0
                }
              }

              const stamps = await q.stamp.findMany({
                include: stampIncludeStatement,
                where: buildFilterWhereClause(filter),
                orderBy: buildOrderByClause(sort),
                ...args,
              })

              return [count, stamps]
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
) => {
  const { modded, capital, region, category, townhall, tradeUnion, search } =
    filter

  // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#postgresql
  // increase chance that user search returns something with or matching
  const parsedQuery = search
    ? search.replace(/(\w)\s+(\w)/g, '$1 | $2')
    : undefined

  return {
    ...(modded ? { modded: parseBoolean(modded) } : {}),
    ...(region ? { region } : {}),
    ...(category ? { category } : {}),
    ...(capital ? { capital } : {}),
    ...(parseBoolean(townhall) ? { townhall: true } : {}),
    ...(parseBoolean(tradeUnion) ? { tradeUnion: true } : {}),
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
  } satisfies Prisma.StampWhereInput
}
export const buildOrderByClause = (orderBy?: FilterState['sort']) => {
  switch (orderBy) {
    case 'newest':
      return { createdAt: 'desc' as const }
    default:
      return { downloads: 'desc' as const }
  }
}
