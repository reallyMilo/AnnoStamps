import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import Container from '@/components/ui/Container'

import AccountForm from './AccountForm'

const UserAccountPage = async () => {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }
  //@ts-expect-error taintObjectReference
  session.user = {
    username: session.user.username,
    biography: session.user.biography,
  }

  return (
    <Container>
      <SessionProvider session={session}>
        <AccountForm />
      </SessionProvider>
    </Container>
  )
}
export default UserAccountPage
