import useSWR from 'swr'

import { fetcher } from '@/lib/utils'

import { UserWithStamps } from '../prisma/queries'

export const useUserStamps = () => {
  const { data, isLoading, error } = useSWR<{ data: UserWithStamps }>(
    '/api/user',
    fetcher
  )

  return {
    userStamps: data?.data,
    isLoading,
    error,
  }
}
