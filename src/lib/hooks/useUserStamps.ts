import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { displayAuthModal, fetcher } from '@/lib/utils'

import { UserWithStamps } from '../prisma/queries'

export const useUserStamps = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  const { data, isLoading, error } = useSWR<{ data: UserWithStamps }>(
    status === 'authenticated' ? '/api/user' : null,
    fetcher
  )

  return {
    status,
    userStamps: data?.data,
    isLoading,
    error,
  }
}
