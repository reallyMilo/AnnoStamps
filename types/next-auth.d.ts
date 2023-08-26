import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      biography?: string
      discord?: string
      emailContact?: string
      id: string
      reddit?: string
      twitch?: string
      twitter?: string
      username?: string
    } & DefaultSession['user']
  }
  interface User extends DefaultUser {
    biography: string
    discord: string
    emailContact: string
    reddit: string
    twitch: string
    twitter: string
    username: string
  }
}
