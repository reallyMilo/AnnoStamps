import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import { Container } from '@/components/ui'

import { SettingsForm } from './SettingsForm'

const UserSettingsPage = async () => {
  const session = await auth()
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Container>
      <SessionProvider session={session}>
        <SettingsForm />
      </SessionProvider>
    </Container>
  )
}
export default UserSettingsPage
