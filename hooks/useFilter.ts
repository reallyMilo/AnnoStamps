import { useRouter } from 'next/router'
import { useImmerReducer } from 'use-immer'

type Filter = {
  category: string
  mods: string
  region: string
}
type Action =
  | { payload: string; type: 'CATEGORY' }
  | { payload: string; type: 'REGION' }
  | { payload: string; type: 'MODS' }

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
      default:
        break
    }
  }

  const [filter, setFilter] = useImmerReducer(filterReducer, initialFilterState)

  return [filter, setFilter] as const
}

export default useFilterReducer
