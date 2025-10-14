'use client'

import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

import type { StampWithRelations } from '@/lib/prisma/models'

import { likeStamp } from '@/app/(site)/stamp/[id]/actions'
import { Button } from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const STALE_TIME = 10 * 60 * 1000

const useLikedStamps = (userId: string | undefined) => {
  const key = userId ? `/api/user/${userId}/likes` : null

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async (url: string): Promise<Set<string>> => {
      const res = await fetch(url)
      const { data } = await res.json()
      return new Set(data)
    },
    {
      dedupingInterval: STALE_TIME,
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    isError: !!error,
    isLoading,
    likedStamps: data ?? new Set(),
    mutate,
  }
}

type LikeButtonProps = {
  initialLikes: number
  stampId: StampWithRelations['id']
}
export const LikeButton = ({ initialLikes, stampId }: LikeButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const { likedStamps, mutate } = useLikedStamps(session?.userId)
  const isLiked = likedStamps.has(stampId)
  const [likes, setLikes] = useState(initialLikes)

  const addLike = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${pathname}`)
      return
    }
    if (isLiked) {
      //TODO: cant unlike until debouncing / rate limiting implemented
      return
    }
    try {
      await mutate(
        async () => {
          const res = await likeStamp(stampId)
          if (!res.ok) throw new Error('Failed to like stamp.')
          return new Set(res.data)
        },
        {
          optimisticData: new Set([stampId, ...likedStamps]),
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        },
      )
      setLikes((p) => p + 1)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <Button
      className={cn(
        'cursor-pointer sm:*:data-[slot=icon]:size-6',
        isLiked && 'sm:*:data-[slot=icon]:text-primary',
      )}
      data-testid="like-stamp"
      onClick={addLike}
      plain
    >
      <HandThumbUpIcon />
      {likes}
    </Button>
  )
}
