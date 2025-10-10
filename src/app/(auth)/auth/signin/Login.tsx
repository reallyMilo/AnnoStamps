'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui'
import { signIn } from '@/lib/auth-client'

const signInDiscord = async (callbackURL: string) => {
  const data = await signIn.social({
    callbackURL,
    provider: 'discord',
  })
  return data
}

const signInGoogle = async (callbackURL: string) => {
  const data = await signIn.social({
    callbackURL,
    provider: 'google',
  })
  return data
}
export const Login = () => {
  const searchParams = useSearchParams()

  const callbackURL = searchParams.get('callbackUrl')?.startsWith('/stamp/')
    ? (searchParams.get('callbackUrl') ?? '/')
    : '/'

  return (
    <>
      <Button onClick={() => signInDiscord(callbackURL)} outline type="submit">
        <Image
          alt="discord sign in"
          height={32}
          src="/discord.svg"
          style={{
            height: 'auto',
            maxWidth: '100%',
          }}
          width={32}
        />
        <span>Sign in with Discord</span>
      </Button>
      <Button onClick={() => signInGoogle(callbackURL)} outline type="submit">
        <Image
          alt="discord sign in"
          height={32}
          src="/google.svg"
          style={{
            height: 'auto',
            maxWidth: '100%',
          }}
          width={32}
        />
        <span>Sign in with Google</span>
      </Button>
    </>
  )
}
