import { redirect } from 'next/navigation'

import { getSession } from '@/auth'
import { Container } from '@/components/ui'

import { SettingsForm } from './SettingsForm'

const UserSettingsPage = async () => {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Container>
      <SettingsForm {...session.user} />
    </Container>
  )
}
export default UserSettingsPage
