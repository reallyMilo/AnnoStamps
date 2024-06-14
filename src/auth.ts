import { PrismaAdapter } from '@auth/prisma-adapter'
import type { DefaultSession, NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import type { Provider } from 'next-auth/providers'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'

import type { UserWithStamps } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

//TODO:initial user setup page shares pages/[user]/settings view

const providers = [Google, Discord] satisfies Provider[]

const config = {
  pages: {
    signIn: '/auth/signin',
    newUser: '/',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/',
  },
  providers,
  adapter: PrismaAdapter(prisma),
  // events: { createUser: sendWelcomeEmail },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        session.user.username = user.username
        session.user.biography = user.biography
        session.user.usernameURL = user.usernameURL
      }
      return session
    },
  },
  session: { strategy: 'database' },
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production' ? true : false,
} satisfies NextAuthConfig

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    //@ts-expect-error not callable
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    //@ts-expect-error property does not exist
    return { id: provider.id, name: provider.name }
  }
})
export const { handlers, auth, signIn, signOut } = NextAuth(config)
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Pick<
      UserWithStamps,
      'id' | 'biography' | 'username' | 'usernameURL'
    > &
      DefaultSession['user']
  }
  interface User {
    biography: string | null
    username: string | null
    usernameURL: string | null
  }
}
