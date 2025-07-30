import type { Metadata } from 'next'
import type { SearchParams } from 'next/dist/server/request/search-params'

import { UserPageView } from '../UserPageView'
import { getUser, userMetadata } from '../util'

export const generateMetadata = async (props: {
  params: Promise<{ user: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const user = await getUser(params.user)

  return user ? userMetadata(user, '1800') : {}
}

const User1800Page = async (props: {
  params: Promise<{ user: string }>
  searchParams: Promise<SearchParams>
}) => {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  return (
    <UserPageView
      params={params}
      searchParams={{ ...searchParams, game: '1800' }}
    />
  )
}

export default User1800Page
