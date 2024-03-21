import { useRouter } from 'next/router'
import qs from 'qs'
import { z } from 'zod'

export const queryParamsSchema = z
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

export type QueryParams = z.infer<typeof queryParamsSchema>
type Action =
  | {
      payload: string
      type: NonNullable<keyof Omit<QueryParams, 'page'>>
    }
  | { payload: number; type: NonNullable<keyof Pick<QueryParams, 'page'>> }

const queryParamsOrder: Action['type'][] = [
  'category',
  'region',
  'modded',
  'capital',
  'sort',
  'page',
  'search',
]

const useQueryParams = ({ pathToQuery = '/' }) => {
  const router = useRouter()
  const { query } = router

  const setQuery = (action: Action) => {
    const queryString = qs.stringify(
      { ...query, [action.type]: action.payload },
      {
        sort: (a, b) =>
          queryParamsOrder.indexOf(a) - queryParamsOrder.indexOf(b),
        filter: (_, value) =>
          (value !== '' && value !== 'false' && value) || undefined,
      }
    )

    if (action.payload === 'page') {
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

  return [query as QueryParams, setQuery] as const
}

export { useQueryParams }
