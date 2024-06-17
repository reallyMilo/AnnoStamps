import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import { Container } from '@/components/ui'

import { SettingsForm } from './SettingsForm'
SessionProvider

const UserSettingsPage = async () => {
  const session = await auth()
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Container>
      <SettingsForm
        username={session.user.username}
        biography={session.user.biography}
      />
    </Container>
  )
}
export default UserSettingsPage
