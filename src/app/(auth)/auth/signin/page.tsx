import { AuthError } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, providerMap, signIn } from '@/auth'
import { Container, Heading, Text } from '@/components/ui'

const SignInPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParams = await props.searchParams
  const session = await auth()
  if (session) {
    redirect(`/${session.userId}`)
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
        {Object.values(providerMap).map((provider) => (
          <form
            action={async () => {
              'use server'
              try {
                await signIn(provider.id, { redirectTo: callbackUrl })
              } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                if (error instanceof AuthError) {
                  return redirect(`/auth/error?error=${error.type}`)
                }

                // Otherwise if a redirects happens NextJS can handle it
                // so you can just re-thrown the error and let NextJS handle it.
                // Docs:
                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                throw error
              }
            }}
            key={provider.name}
          >
            <button
              className="focus:ring-opacity-25 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border bg-white p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:ring-4 focus:ring-gray-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
              type="submit"
            >
              <Image
                alt="discord sign in"
                height={32}
                src={`/${provider.id}.svg`}
                style={{
                  height: 'auto',
                  maxWidth: '100%',
                }}
                width={32}
              />
              <span>Sign in with {provider.name}</span>
            </button>
          </form>
        ))}
      </div>
      <Text className="mt-4">
        Please contact us on Discord to transfer your Stamps made with email
        login.
      </Text>
    </Container>
  )
}

export default SignInPage
