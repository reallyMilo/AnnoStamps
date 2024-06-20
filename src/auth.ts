import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Prisma } from '@prisma/client'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import type { AdapterSession, AdapterUser } from 'next-auth/adapters'
import type { Provider } from 'next-auth/providers'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'

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
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          biography: user.biography,
          username: user.username,
          usernameURL: user.usernameURL,
        },
      }
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

  //eslint-disable-next-line
  interface Session extends AdapterSession {
    user: Pick<User, 'id' | 'biography' | 'username' | 'usernameURL'> &
      AdapterUser
  }
  //eslint-disable-next-line
  interface User extends Prisma.UserGetPayload<true> {}
}
