'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import qs from 'qs'

import type { FilterState } from '@/lib/constants'

type Action =
  | {
      payload: string
      type: keyof Omit<FilterState, 'page'>
    }
  | { payload: number; type: keyof Pick<FilterState, 'page'> }

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
  const query = searchParams ? qs.parse(searchParams?.toString()) : {}

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
      router.push(`${pathToFilter}?${queryString}`)
      return
    }
    router.replace(`${pathToFilter}?${queryString}`)
  }
  const filter = query as unknown as FilterState

  return [filter, setFilter] as const
}

export default useFilter
