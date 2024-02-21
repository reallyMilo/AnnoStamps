import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'

import prisma from './lib/prisma/singleton'

export const config = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
  },
  //TODO: HTTP based email provider
  //events: { createUser: sendWelcomeEmail },
  providers: [Discord, Google],
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
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
