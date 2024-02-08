import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { UserWithStamps } from '../prisma/queries'

export const useUserStamps = () => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/auth/signin')
    },
  })

  const { data, isLoading, error } = useSWR<{ data: UserWithStamps }>(
    status === 'authenticated' ? '/api/user' : null,
    async (url: string) => {
      const res = await fetch(url)

      if (!res.ok) {
        const error = new Error(
          'An error occurred while fetching the data.'
        ) as Error & { info: string; status: number }
        error.info = await res.json()
        error.status = res.status
        throw error
      }

      return res.json()
    }
  )

  return {
    userStamps: data?.data,
    isLoading,
    error,
  }
}
