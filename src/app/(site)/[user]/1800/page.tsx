import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { auth } from '@/auth'

import { UserHomePage } from '../UserHomePage'
import { UserPublicPage } from '../UserPublicPage'
import { getUserWithStamps, userMetadata } from '../util'

// export function generateStaticParams() {
//   return [] // add content creators here to generate path at build time
// }

export const generateMetadata = async ({
  params,
}: {
  params: { user: string }
}): Promise<Metadata> => {
  const user = await getUserWithStamps(params.user)

  return user ? userMetadata(user, '1800') : {}
}

const User1800Page = async ({ params }: { params: { user: string } }) => {
  const user = await getUserWithStamps(params.user, '1800')

  if (!user) {
    notFound()
  }
  const session = await auth()

  return user.id === session?.userId ? (
    <UserHomePage {...user} />
  ) : (
    <UserPublicPage {...user} />
  )
}

export default User1800Page
