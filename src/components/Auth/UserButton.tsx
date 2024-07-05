import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { UserMenu } from './UserMenu'

export const UserButton = async () => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <UserMenu />
    </SessionProvider>
  )
}
