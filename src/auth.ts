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
        session,
        user: {
          ...user,
          biography: dbSession?.user.biography,
          isEmailEnabled: dbSession?.user.preferences[0]?.enabled ?? true,
          isNotificationUnread: dbSession?.user.notifications[0]?.isRead
            ? !dbSession?.user.notifications[0].isRead
            : false,
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

// const providers = [Google, Discord] satisfies Provider[]

// const adapter = {
//   ...PrismaAdapter(prisma),
//   async getSessionAndUser(sessionToken) {
//     const userAndSession = await prisma.session.findUnique({
//       include: {
//         user: {
//           include: {
//             notifications: {
//               orderBy: {
//                 createdAt: 'desc',
//               },
//               select: {
//                 isRead: true,
//               },
//               take: 1,
//             },
//             preferences: {
//               select: {
//                 enabled: true,
//               },
//               where: {
//                 channel: 'email',
//               },
//             },
//           },
//         },
//       },
//       where: { sessionToken },
//     })

//     if (!userAndSession) return null
//     const { user, ...session } = userAndSession
//     return { session, user }
//   },
// } as Adapter

// const config = {
//   adapter,
//   callbacks: {
//     session: async ({ newSession, session, trigger, user }) => {
//       if (trigger === 'update' && newSession?.username) {
//         return {
//           ...session,
//           user: {
//             ...session.user,
//             username: newSession.username,
//             usernameURL: newSession.username.toLowerCase(),
//           },
//         }
//       }
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           biography: user.biography,
//           username: user.username,
//           usernameURL: user.usernameURL,
//         },
//       }
//     },
//   },
//   pages: {
//     error: '/auth/error',
//     newUser: '/auth/new-user',
//     signIn: '/auth/signin',
//     signOut: '/',
//     verifyRequest: '/',
//   },
//   providers,
//   session: { strategy: 'database' },
//   trustHost: true,
// } satisfies NextAuthConfig

// export const providerMap = providers.map((provider) => {
//   if (typeof provider === 'function') {
//     //@ts-expect-error not callable
//     const providerData = provider()
//     return { id: providerData.id, name: providerData.name }
//   } else {
//     //@ts-expect-error property does not exist
//     return { id: provider.id, name: provider.name }
//   }
// })

// export const { auth, handlers, signIn, signOut } = NextAuth(config)
// declare module 'next-auth' {
//   interface Session extends AdapterSession {
//     user: AdapterUser &
//       Pick<
//         User,
//         | 'biography'
//         | 'notifications'
//         | 'preferences'
//         | 'username'
//         | 'usernameURL'
//       >
//   }

//   interface User
//     extends Prisma.UserGetPayload<{
//       include: {
//         notifications: {
//           orderBy: {
//             createdAt: 'desc'
//           }
//           select: {
//             isRead: true
//           }
//           take: 1
//         }
//         preferences: {
//           select: {
//             enabled: true
//           }
//           where: {
//             channel: 'email'
//           }
//         }
//       }
//     }> {}
// }
