import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import Container from '@/components/ui/Container'

import CreateStampForm from './CreateStampForm'

const CreateStampPage = async () => {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Container className="md:max-w-5xl">
      <CreateStampForm />
    </Container>
  )
}

export default CreateStampPage
