'use client'
import { useRouter, useSearchParams } from 'next/navigation'
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
type Action =
  | {
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
  | { payload: number; type: 'page' }

const sortOrder: Action['type'][] = [
  'category',
  'region',
  'modded',
  'capital',
  'townhall',
  'tradeunion',
  'sort',
  'page',
  'search',
]

const useFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pathToFilter = '/'

  const setFilter = (action: Action) => {
    const queryString = qs.stringify(
      { ...searchParams, [action.type]: action.payload },
      {
        sort: (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b),
        filter: (_, value) =>
          (value !== '' && value !== 'false' && value) || undefined,
      }
    )

    if (action.payload === 'page') {
      router.push(`${pathToFilter}?${queryString}`)
      return
    }
    router.replace(`${pathToFilter}?${queryString}`)
  }
  const filter = searchParams as unknown as FilterState

  return [filter, setFilter] as const
}

export default useFilter
