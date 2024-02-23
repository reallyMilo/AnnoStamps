import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, signIn } from '@/auth'
import Container from '@/components/ui/Container'

const SignInPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const session = await auth()
  if (session) {
    redirect('/user/stamps')
  }
  const redirectTo =
    typeof searchParams.callbackUrl === 'string' &&
    searchParams.callbackUrl?.startsWith('/stamp/')
      ? searchParams.callbackUrl
      : '/user/stamps'
  //https://github.com/nextauthjs/next-auth/issues/9293#issuecomment-1834443691
  const providers = ['google', 'discord']
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

      <h3 className="mt-6 text-center text-2xl font-bold">Welcome!</h3>

      <div className="mt-10 flex flex-col space-y-4 border">
        {Object.values(providers).map((provider) => (
          <form
            key={provider}
            action={async () => {
              'use server'
              await signIn(provider, { redirectTo })
            }}
          >
            <button className="flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border bg-white p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500">
              <Image
                src={`/${provider}.svg`}
                alt="discord sign in"
                width={32}
                height={32}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <span>Sign in with {provider}</span>
            </button>
          </form>
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
