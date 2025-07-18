import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Container } from '@/components/ui'

const NewUserPage = async () => {
  const session = await auth()
  if (!session) {
    redirect(`/auth/sign-in`)
  }

  if (session) {
    redirect(`/${session.userId}/settings`)
  }

  return <Container>redirecting</Container>
}

export default NewUserPage
