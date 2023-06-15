import { useRouter } from 'next/router'
import { useImmerReducer } from 'use-immer'

type Filter = {
  capital: string
  category: string
  mods: string
  region: string
  sort: string
  townhall: string
  tradeUnion: string
}
type Action =
  | { payload: string; type: 'CATEGORY' }
  | { payload: string; type: 'REGION' }
  | { payload: string; type: 'MODS' }
  | { payload: string; type: 'CAPITAL' }
  | { payload: string; type: 'TOWNHALL' }
  | { payload: string; type: 'TRADEUNION' }
  | { payload: string; type: 'SORT' }

const useFilterReducer = (initialFilterState: Filter) => {
  const router = useRouter()
  const { query } = router

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
      case 'MODS':
        draft.mods = action.payload
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
      default:
        break
    }
  }

  const [filter, setFilter] = useImmerReducer(filterReducer, initialFilterState)

  return [filter, setFilter] as const
}

export default useFilterReducer
