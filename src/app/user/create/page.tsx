import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import Container from '@/components/ui/Container'

import CreateStampForm from './CreateStampForm'

const CreateStampPage = async () => {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  if (!session.user.usernameURL) {
    return (
      <Container>
        <div className=" bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please set username first.{' '}
                <Link
                  href="/user/account"
                  className="font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Click here to set username.
                </Link>
              </p>
            </div>
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
