import { useRouter } from 'next/router'
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
    tradeUnion: z.string(),
  })
  .partial()

export type FilterState = z.infer<typeof filterSchema>
type Action =
  | { payload: string; type: 'CATEGORY' }
  | { payload: string; type: 'REGION' }
  | { payload: string; type: 'MODDED' }
  | { payload: string; type: 'CAPITAL' }
  | { payload: string; type: 'TOWNHALL' }
  | { payload: string; type: 'TRADEUNION' }
  | { payload: string; type: 'SORT' }
  | { payload: string; type: 'SEARCH' }

const useFilter = () => {
  const router = useRouter()
  const { query } = router

  const setFilter = (action: Action) => {
    if (!action.payload) {
      if (
        Object.prototype.hasOwnProperty.call(query, action.type.toLowerCase())
      ) {
        delete query[action.type.toLowerCase()]
      }
      router.replace({
        pathname: '/',
        query,
      })
      return
    }
    switch (action.type) {
      case 'CATEGORY':
        router.replace({
          pathname: '/',
          query: { ...query, category: action.payload },
        })
        break
      case 'REGION':
        router.replace({
          pathname: '/',
          query: { ...query, region: action.payload },
        })
        break
      case 'MODDED':
        router.replace({
          pathname: '/',
          query: { ...query, modded: action.payload },
        })
        break
      case 'CAPITAL':
        router.replace({
          pathname: '/',
          query: { ...query, capital: action.payload },
        })
        break
      case 'TOWNHALL':
        router.replace({
          pathname: '/',
          query: { ...query, townhall: action.payload },
        })
        break
      case 'TRADEUNION':
        router.replace({
          pathname: '/',
          query: { ...query, tradeUnion: action.payload },
        })
        break
      case 'SORT':
        router.replace({
          pathname: '/',
          query: { ...query, sort: action.payload },
        })
        break
      case 'SEARCH':
        router.replace({
          pathname: '/',
          query: { ...query, search: action.payload },
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
