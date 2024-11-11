import type { Prisma } from '@prisma/client'
import type { NextAuthConfig } from 'next-auth'
import type { Adapter, AdapterSession } from 'next-auth/adapters'
import type { Provider } from 'next-auth/providers'

import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'

import prisma from '@/lib/prisma/singleton'
//TODO:initial user setup page shares pages/[user]/settings view

const providers = [Google, Discord] satisfies Provider[]

const adapter = {
  ...PrismaAdapter(prisma),
  async getSessionAndUser(sessionToken) {
    const userAndSession = await prisma.session.findUnique({
      include: {
        user: {
          include: {
            notifications: {
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                isRead: true,
              },
              take: 1,
            },
          },
        },
      },
      where: { sessionToken },
    })

    if (!userAndSession) return null
    const { user, ...session } = userAndSession
    return { session, user }
  },
} as Adapter

const config = {
  adapter,
  callbacks: {
    session: async ({ newSession, session, trigger, user }) => {
      if (trigger === 'update' && newSession?.username) {
        return {
          ...session,
          user: {
            ...session.user,
            username: newSession.username,
            usernameURL: newSession.username.toLowerCase(),
          },
        }
      }
      return {
        ...session,
        user: {
          ...session.user,
          biography: user.biography,
          image: user.image,
          username: user.username,
          usernameURL: user.usernameURL,
        },
      }
    },
  },
  pages: {
    error: '/auth/error',
    newUser: '/',
    signIn: '/auth/signin',
    signOut: '/',
    verifyRequest: '/',
  },
  providers,
  session: { strategy: 'database' },
  trustHost: true,
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

export const { auth, handlers, signIn, signOut } = NextAuth(config)
declare module 'next-auth' {
  interface Session extends AdapterSession {
    user: Pick<
      User,
      'biography' | 'image' | 'notifications' | 'username' | 'usernameURL'
    >
  }

  interface User
    extends Prisma.UserGetPayload<{
      include: {
        notifications: {
          orderBy: {
            createdAt: 'desc'
          }
          select: {
            isRead: true
          }
          take: 1
        }
      }
    }> {}
}
