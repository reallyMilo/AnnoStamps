import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { fetcher } from '@/lib/utils'

import { UserWithStamps } from '../prisma/queries'

export const useUserStamps = () => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const { data, isLoading, error } = useSWR<{ data: UserWithStamps }>(
    status === 'authenticated' ? '/api/user' : null,
    fetcher
  )

  return {
    userStamps: data?.data,
    isLoading,
    error,
  }
}
