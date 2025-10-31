import { redirect } from 'next/navigation'

import { getSession } from '@/auth'
import { Container } from '@/components/ui'

const NewUserPage = async () => {
  const session = await getSession()
  if (!session) {
    redirect(`/auth/signin`)
  }

  if (session) {
    redirect(`/${session.userId}/settings`)
  }

  return <Container>redirecting</Container>
}

export default NewUserPage
