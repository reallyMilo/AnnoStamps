import { useRouter } from 'next/router'
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

type Action = {
  isAddParam?: boolean
  payload: string
  type: Required<keyof QueryParams>
}

const queryParamsOrder: Action['type'][] = [
  'category',
  'region',
  'capital',
  'sort',
  'page',
  'search',
]

const useQueryParams = (pathToQuery = '/stamps') => {
  const router = useRouter()
  const { asPath } = router

  const setQuery = ({ type, payload, isAddParam = true }: Action) => {
    const searchParams = asPath.slice(pathToQuery.length)
    const newQuery = isAddParam
      ? `${searchParams}&${type}=${payload}`
      : searchParams
    const parsedQuery = qs.parse(newQuery, {
      ignoreQueryPrefix: true,
      duplicates: 'combine',
    })

    if (type === 'search' || type === 'sort' || type === 'page') {
      parsedQuery[type] = payload.length > 0 ? payload : undefined
    }

    const queryString = qs.stringify(parsedQuery, {
      arrayFormat: 'repeat',
      sort: (a, b) =>
        queryParamsOrder.indexOf(a as Action['type']) -
        queryParamsOrder.indexOf(b as Action['type']),
      filter: (prefix, value) => {
        if (isAddParam === false && prefix === type && value === payload) {
          return
        }
        return value
      },
      skipNulls: true,
    })

    if (payload === 'page') {
      router.push({
        pathname: pathToQuery,
        query: queryString,
      })
      return
    }
    router.replace({
      pathname: pathToQuery,
      query: queryString,
    })
  }
  const searchParams = asPath.split('?')[1]
  return [searchParams, setQuery] as const
}

export { type QueryParams, queryParamsSchema, useQueryParams }
