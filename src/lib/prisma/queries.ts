import { ParsedUrlQuery } from 'querystring'

import { Filter, filterSchema } from '../hooks/useFilter'
import { parseBoolean, stampsPerPage } from '../utils'
import prisma from './singleton'

export const getStampsAndCount = async (query: ParsedUrlQuery) => {
  const { page, sort, ...filter } = filterSchema.parse(query)

  const pageNumber = parseInt(page || '1', 10)

  const buildWhereClause = (filter: Omit<Filter, 'sort' | 'page'>) => {
    const { modded, capital, region, category, townhall, tradeUnion, search } =
      filter
    return {
      modded: parseBoolean(modded),
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
    }
  }
  const buildOrderByClause = (orderBy?: Filter['sort']) => {
    switch (orderBy) {
      case 'newest':
        return { createdAt: 'desc' as const }
      default:
        return { downloads: 'desc' as const }
    }
  }
  const [count, stamps] = await prisma.$transaction([
    prisma.stamp.count({
      where: buildWhereClause(filter),
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
      where: buildWhereClause(filter),

      orderBy: buildOrderByClause(sort),
      skip: (pageNumber - 1) * stampsPerPage(),
      take: stampsPerPage(),
    }),
  ])

  return [count, stamps] as const
}
