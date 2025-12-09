import { Prisma } from '../../../prisma/generated/prisma/client'
import { type QueryParams } from '../constants'

export const buildFilterWhereClause = (
  filter: Omit<QueryParams, 'page' | 'sort'>,
): Prisma.StampWhereInput => {
  const { capital, category, game, region, search } = filter
  const where: Prisma.StampWhereInput = {
    game,
  }

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
