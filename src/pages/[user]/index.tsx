import { useSession } from 'next-auth/react'

import UserHomePage from '@/modules/users/views/users-home-view'
import UserPublicPage from '@/modules/users/views/users-public-view'
import {
  getStaticPaths as _getStaticPaths,
  getStaticProps as _getStaticProps,
  type UsernamePageProps,
} from '@/modules/users/views/users-view.getStaticProps'

export const getStaticPaths = _getStaticPaths
export const getStaticProps = _getStaticProps
const Page = (props: UsernamePageProps) => {
  const { data: session } = useSession()
  return props?.user?.id === session?.user.id ? (
    <UserHomePage {...props} />
  ) : (
    <UserPublicPage {...props} />
  )
}

export default Page
