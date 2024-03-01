import { DefaultSession, DefaultUser } from 'next-auth'

import type { UserWithStamps } from '@/lib/prisma/queries'
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
  interface User
    extends Pick<UserWithStamps, 'biography' | 'username' | 'usernameURL'>,
      DefaultUser {}
}
