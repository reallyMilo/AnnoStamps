import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { customSession } from 'better-auth/plugins'
import { headers } from 'next/headers'
import { cache } from 'react'

import prisma from '@/lib/prisma/singleton'

export const auth = betterAuth({
  account: {
    fields: {
      accessToken: 'access_token',
      accessTokenExpiresAt: 'expires_at',
      accountId: 'providerAccountId',
      idToken: 'id_token',
      providerId: 'provider',
      refreshToken: 'refresh_token',
    },
  },
  cookieCache: {
    enabled: true,
    maxAge: 10 * 60,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [
    nextCookies(),
    customSession(async ({ session, user }) => {
      const dbSession = await prisma.session.findUnique({
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
              preferences: {
                select: {
                  enabled: true,
                },
                where: {
                  channel: 'email',
                },
              },
            },
          },
        },
        where: { sessionToken: session.token },
      })

      return {
        ...session,
        user: {
          ...user,
          biography: dbSession?.user.biography,
          isEmailEnabled: dbSession?.user.preferences[0]?.enabled ?? true,
          isNotificationRead: dbSession?.user.notifications[0]?.isRead ?? true,
          username: dbSession?.user.username,
          usernameURL: dbSession?.user.usernameURL,
        },
      }
    }),
  ],
  session: {
    fields: {
      expiresAt: 'expires',
      token: 'sessionToken',
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
    },
  },
})

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
})
