import { Prisma, PrismaClient } from '@prisma/client'

import { FilterState } from '../hooks/useFilter'
import { parseBoolean } from '../utils'
import {
  imageExtension,
  stampExtensions,
  stampIncludeStatement,
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
            args?: Pick<Prisma.StampFindManyArgs, 'take' | 'skip'>
          ) {
            return await prisma.$transaction([
              prisma.stamp.count({
                where: buildFilterWhereClause(filter),
              }),
              prisma.stamp.findMany({
                include: stampIncludeStatement,
                where: buildFilterWhereClause(filter),
                orderBy: buildOrderByClause(sort),
                ...args,
              }),
            ])
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
  return {
    ...(modded ? { modded: parseBoolean(modded) } : {}),
    ...(region ? { region } : {}),
    ...(category ? { category } : {}),
    ...(capital ? { capital } : {}),
    ...(parseBoolean(townhall) ? { townhall: true } : {}),
    ...(parseBoolean(tradeUnion) ? { tradeUnion: true } : {}),
    ...(search
      ? {
          title: {
            search,
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
