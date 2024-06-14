'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { z } from 'zod'

const queryParamsSchema = z
  .object({
    capital: z.union([z.string().array(), z.string()]),
    category: z.union([z.string().array(), z.string()]),
    page: z.string(),
    region: z.union([z.string().array(), z.string()]),
    search: z.string(),
    sort: z.string(),
  })
  .partial()

type QueryParams = z.infer<typeof queryParamsSchema>

const queryParamsOrder = [
  'category',
  'region',
  'capital',
  'sort',
  'page',
  'search',
]

const useQueryParams = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQuery = (params: object) => {
    const queryString = qs.stringify(params, {
      arrayFormat: 'repeat',
      sort: (a, b) => queryParamsOrder.indexOf(a) - queryParamsOrder.indexOf(b),
      skipNulls: true,
    })
    const isEmpty = queryString.length === 0

    return isEmpty ? pathname : `${pathname}?${queryString}`
  }

  return [searchParams, setQuery] as const
}

export { type QueryParams, queryParamsSchema, useQueryParams }
