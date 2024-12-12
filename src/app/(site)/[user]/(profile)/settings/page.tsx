import type { Prisma } from '@prisma/client'

import { SessionProvider } from 'next-auth/react'
import { unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Container } from '@/components/ui'
import prisma from '@/lib/prisma/singleton'

import { SettingsForm } from './SettingsForm'

const getUserPreferences = unstable_cache(
  async (userId: Prisma.PreferenceGetPayload<true>['userId']) =>
    prisma.preference.findFirst({
      where: {
        userId,
      },
    }),
  ['getUserPreferences'],
  {
    revalidate: 86400,
    tags: ['getUserPreferences'],
  },
)
const UserSettingsPage = async () => {
  const session = await auth()
  if (!session) {
    redirect('/auth/signin')
  }
  const { biography, username } = session.user

  const preferences = await getUserPreferences(session.userId)

  return (
    <Container>
      <SessionProvider session={session}>
        <SettingsForm
          biography={biography}
          enabled={preferences?.enabled ?? true}
          username={username}
        />
      </SessionProvider>
    </Container>
  )
}
export default UserSettingsPage
