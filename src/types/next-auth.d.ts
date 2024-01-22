import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      biography?: string
      id: string
      username?: string
    } & DefaultSession['user']
  }
  interface User extends DefaultUser {
    biography: string
    discord: string
    username: string
  }
}
