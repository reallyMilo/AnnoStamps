import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import prisma from '@/lib/prisma/singleton'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  session: {
    fields: {
      expiresAt: 'expires',
      token: 'sessionToken',
    },
  },
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
