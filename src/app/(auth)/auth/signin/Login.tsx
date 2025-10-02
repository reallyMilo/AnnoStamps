'use client'

import Image from 'next/image'

import { signIn } from '@/lib/auth-client'

const signInDiscord = async () => {
  const data = await signIn.social({
    provider: 'discord',
  })
  return data
}

const signInGoogle = async () => {
  const data = await signIn.social({
    provider: 'google',
  })
  return data
}
export const Login = () => {
  return (
    <>
      <button
        className="focus:ring-opacity-25 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border bg-white p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:ring-4 focus:ring-gray-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
        onClick={signInDiscord}
        type="submit"
      >
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
      </button>
      <button
        className="focus:ring-opacity-25 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border bg-white p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:ring-4 focus:ring-gray-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
        onClick={signInGoogle}
        type="submit"
      >
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
      </button>
    </>
  )
}
