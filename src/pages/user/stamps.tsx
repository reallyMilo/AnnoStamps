// deprecated
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Container from '@/components/ui/Container'

const Stamps = () => {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/auth/signin')
    },
  })

  if (!session?.user.usernameURL) {
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
            <p className="text-sm text-yellow-700">
              This account currently does not have a username set.{' '}
              <Link
                href="/user/account"
                className="font-medium text-yellow-700 underline hover:text-yellow-600"
              >
                Please set your username.
              </Link>
            </p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Link className="underline" href={`/${session.user.usernameURL}`}>
        Your stamps are manageable at your public route.
      </Link>
    </Container>
  )
}

export default Stamps
