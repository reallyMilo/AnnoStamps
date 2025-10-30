import { customSessionClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import type { auth } from '@/auth'

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL!,
  plugins: [customSessionClient<typeof auth>()],
})
export type Session = NonNullable<
  ReturnType<(typeof authClient)['useSession']>['data']
>
export const { signIn, signOut, useSession } = authClient
