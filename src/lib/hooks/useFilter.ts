import { useRouter } from 'next/router'
import qs from 'qs'
import { z } from 'zod'

export const filterSchema = z
  .object({
    capital: z.string(),
    category: z.string(),
    modded: z.string(),
    page: z.string(),
    region: z.string(),
    search: z.string(),
    sort: z.string(),
    townhall: z.string(),
    tradeunion: z.string(),
  })
  .partial()

export type FilterState = z.infer<typeof filterSchema>
type Action = {
  payload: string
  type:
    | 'category'
    | 'region'
    | 'modded'
    | 'capital'
    | 'townhall'
    | 'tradeunion'
    | 'sort'
    | 'search'
}

const sortOrder: Action['type'][] = [
  'category',
  'region',
  'modded',
  'capital',
  'townhall',
  'tradeunion',
  'sort',
  'search',
]

const useFilter = () => {
  const router = useRouter()
  const { query } = router

  const setFilter = (action: Action) => {
    if (!action.payload || action.payload === 'false') {
      if (Object.prototype.hasOwnProperty.call(query, action.type)) {
        delete query[action.type]
      }
      router.replace({
        pathname: '/',
        query,
      })
      return
    }

    const queryString = qs.stringify(
      { ...query, [action.type]: action.payload },
      {
        sort: (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b),
      }
    )

    switch (action.type) {
      case 'category':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'region':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'modded':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'capital':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'townhall':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'tradeunion':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'sort':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      case 'search':
        router.replace({
          pathname: '/',
          query: queryString,
        })
        break
      default:
        break
    }
  }
  const filter = query as FilterState

  return [filter, setFilter] as const
}

export default useFilter
