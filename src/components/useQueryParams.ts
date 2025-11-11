'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import qs from 'qs'

import type { QueryParams } from '@/lib/constants'

const queryParamsOrder = [
  'game',
  'category',
  'region',
  'capital',
  'sort',
  'search',
  'page',
] satisfies (keyof QueryParams)[]

const useQueryParams = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const stringifyQuery = (searchParams: URLSearchParams, params: object) => {
    const previousQuery = qs.parse(searchParams.toString())

    const queryString = qs.stringify(
      { ...previousQuery, ...params },
      {
        arrayFormat: 'repeat',
        skipNulls: true,
        sort: (a, b) =>
          queryParamsOrder.indexOf(a as keyof QueryParams) -
          queryParamsOrder.indexOf(b as keyof QueryParams),
      },
    )
    const isEmpty = queryString.length === 0

    return isEmpty ? pathname : `${pathname}?${queryString}`
  }

  return [searchParams, stringifyQuery] as const
}

export { useQueryParams }
