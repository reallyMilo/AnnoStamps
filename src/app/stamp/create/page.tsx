import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Container, Text } from '@/components/ui'

import { CreateStampForm } from './CreateStampForm'

const CreateStampPage = async () => {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  if (!session?.user.username) {
    return (
      <Container>
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <Text className="text-sm text-yellow-700">
              This account currently does not have a username set.{' '}
              <Link
                href={`/${session.user.id}/settings`}
                className="font-medium text-yellow-700 underline hover:text-yellow-600"
              >
                Please set your username.
              </Link>
            </Text>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="md:max-w-5xl">
      <CreateStampForm />
    </Container>
  )
}

export default CreateStampPage
