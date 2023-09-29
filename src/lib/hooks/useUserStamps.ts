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

  const {
    data: userStamps,
    isLoading,
    error,
  } = useSWR<UserWithStamps>(
    status === 'authenticated' ? '/api/user' : null,
    fetcher
  )

  return {
    status,
    userStamps,
    isLoading,
    error,
  }
}
