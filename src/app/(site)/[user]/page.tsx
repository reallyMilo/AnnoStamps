import type { Metadata } from 'next'

import { UserPageView } from './UserPageView'
import { getUser, userMetadata } from './util'

export const generateMetadata = async (props: {
  params: Promise<{ user: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const user = await getUser(params.user)

  return user ? userMetadata(user) : {}
}

const UserPage = async (props: {
  params: Promise<{ user: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  return (
    <UserPageView
      params={params}
      searchParams={{ ...searchParams, game: '117' }}
    />
  )
}

export default UserPage
