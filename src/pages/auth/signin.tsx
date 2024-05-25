import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProviders, signIn } from 'next-auth/react'

import { auth } from '@/auth'
import { Container, Heading } from '@/components/ui'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await auth(context.req, context.res)

  if (session) {
    return { redirect: { destination: '/' } }
  }
  const providers = await getProviders()
  const { query } = context

  const redirect =
    typeof query.callbackUrl === 'string' &&
    query.callbackUrl?.startsWith('/stamp/')
      ? query.callbackUrl
      : '/'

  return {
    props: {
      providers,
      redirect,
    },
  }
}

const SignInPage = ({
  providers,
  redirect,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container className="flex max-w-md flex-col justify-center">
      <Link href="/" className="mx-auto">
        <Image
          src="/anno-stamps-logo.svg"
          width="160"
          height="60"
          alt="Anno Stamps"
          style={{
            width: '160px',
            maxWidth: '160px',
            height: '60px',
          }}
        />
      </Link>

      <Heading className="mt-6 text-center">Welcome!</Heading>

      <div className="mt-10 flex flex-col space-y-4 border">
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: redirect })}
              className="flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border bg-white p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
            >
              <Image
                src={`/${provider.id}.svg`}
                alt="discord sign in"
                width={32}
                height={32}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <span>Sign in with {provider.name}</span>
            </button>
          ))}
      </div>
      <p className="mt-4">
        Please contact us on Discord to transfer your Stamps made with email
        login.
      </p>
    </Container>
  )
}

export default SignInPage
