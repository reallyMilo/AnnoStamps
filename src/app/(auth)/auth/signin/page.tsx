import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Container, Heading, Text } from '@/components/ui'

import { Login } from './Login'

const SignInPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParams = await props.searchParams
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session?.user) {
    return redirect('/')
  }

  const callbackUrl =
    typeof searchParams['callbackUrl'] === 'string' &&
    searchParams['callbackUrl'].startsWith('/stamp/')
      ? searchParams['callbackUrl']
      : '/'

  return (
    <Container className="flex max-w-md flex-col justify-center">
      <Link className="mx-auto" href="/">
        <Image
          alt="Anno Stamps"
          height="60"
          src="/anno-stamps-logo.svg"
          style={{
            height: '60px',
            maxWidth: '160px',
            width: '160px',
          }}
          width="160"
        />
      </Link>

      <Heading className="mt-6 text-center">Welcome!</Heading>

      <div className="mt-10 flex flex-col space-y-4">
        <Login></Login>
      </div>
      <Text className="mt-4">
        Please contact us on Discord to transfer your Stamps made with email
        login.
      </Text>
    </Container>
  )
}

export default SignInPage
