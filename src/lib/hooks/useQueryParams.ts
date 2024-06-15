'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import qs from 'qs'

import type { QueryParams } from '../constants'

const queryParamsOrder = [
  'category',
  'region',
  'capital',
  'sort',
  'page',
  'search',
] satisfies (keyof QueryParams)[]

const useQueryParams = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const parsedQuery = qs.parse(searchParams?.toString() ?? '') as QueryParams

  const stringifyQuery = (params: object) => {
    const queryString = qs.stringify(params, {
      arrayFormat: 'repeat',
      sort: (a, b) =>
        queryParamsOrder.indexOf(a as keyof QueryParams) -
        queryParamsOrder.indexOf(b as keyof QueryParams),
      skipNulls: true,
    })
    const isEmpty = queryString.length === 0

    return isEmpty ? pathname : `${pathname}?${queryString}`
  }

  return [searchParams, parsedQuery, stringifyQuery] as const
}

export { useQueryParams }
