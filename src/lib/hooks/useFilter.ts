import { useRouter } from 'next/router'
import { useImmerReducer } from 'use-immer'
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

export type Filter = z.infer<typeof filterSchema>
type Action =
  | { payload: string; type: 'CATEGORY' }
  | { payload: string; type: 'REGION' }
  | { payload: string; type: 'MODDED' }
  | { payload: string; type: 'CAPITAL' }
  | { payload: string; type: 'TOWNHALL' }
  | { payload: string; type: 'TRADEUNION' }
  | { payload: string; type: 'SORT' }
  | { payload: string; type: 'SEARCH' }

const useFilterReducer = () => {
  const router = useRouter()
  const { query } = router
  const initialFilterState = filterSchema.parse(query)

  const filterReducer = (draft: Filter, action: Action) => {
    switch (action.type) {
      case 'CATEGORY':
        draft.category = action.payload
        router.push({
          pathname: '/',
          query: { ...query, category: action.payload },
        })
        break
      case 'REGION':
        draft.region = action.payload
        router.push({
          pathname: '/',
          query: { ...query, region: action.payload },
        })
        break
      case 'MODDED':
        draft.modded = action.payload
        router.push({
          pathname: '/',
          query: { ...query, modded: action.payload },
        })
        break
      case 'CAPITAL':
        draft.capital = action.payload
        router.push({
          pathname: '/',
          query: { ...query, capital: action.payload },
        })
        break
      case 'TOWNHALL':
        draft.townhall = action.payload
        router.push({
          pathname: '/',
          query: { ...query, townhall: action.payload },
        })
        break
      case 'TRADEUNION':
        draft.tradeUnion = action.payload
        router.push({
          pathname: '/',
          query: { ...query, tradeUnion: action.payload },
        })
        break
      case 'SORT':
        draft.sort = action.payload
        router.push({
          pathname: '/',
          query: { ...query, sort: action.payload },
        })
        break
      case 'SEARCH':
        draft.sort = action.payload
        router.push({
          pathname: '/',
          query: { ...query, search: action.payload },
        })
        break
      default:
        break
    }
  }

  const [filter, setFilter] = useImmerReducer(filterReducer, initialFilterState)

  return [filter, setFilter] as const
}

export default useFilterReducer
