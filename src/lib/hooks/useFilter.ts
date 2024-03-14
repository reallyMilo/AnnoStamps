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
  })
  .partial()

export type FilterState = z.infer<typeof filterSchema>
type Action =
  | {
      payload: string
      type: NonNullable<keyof Omit<FilterState, 'page'>>
    }
  | { payload: number; type: NonNullable<keyof Pick<FilterState, 'page'>> }

const sortOrder: Action['type'][] = [
  'category',
  'region',
  'modded',
  'capital',
  'sort',
  'page',
  'search',
]

const useFilter = () => {
  const router = useRouter()
  const { query } = router

  const pathToFilter = '/'

  const setFilter = (action: Action) => {
    const queryString = qs.stringify(
      { ...query, [action.type]: action.payload },
      {
        sort: (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b),
        filter: (_, value) =>
          (value !== '' && value !== 'false' && value) || undefined,
      }
    )

    if (action.payload === 'page') {
      router.push({
        pathname: pathToFilter,
        query: queryString,
      })
      return
    }
    router.replace({
      pathname: pathToFilter,
      query: queryString,
    })
  }
  const filter = query as FilterState

  return [filter, setFilter] as const
}

export default useFilter
