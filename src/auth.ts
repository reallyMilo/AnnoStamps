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
          biography: dbSession?.user.biography ?? null,
          isEmailEnabled: dbSession?.user.preferences[0]?.enabled ?? true,
          username: dbSession?.user.username ?? null,
          usernameURL: dbSession?.user.usernameURL ?? null,
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
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
})

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
})
