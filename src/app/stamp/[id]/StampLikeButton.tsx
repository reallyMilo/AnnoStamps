'use client'

import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { startTransition, useOptimistic } from 'react'
import useSWR from 'swr'

import { Button } from '@/components/ui'
import { StampWithRelations, UserWithStamps } from '@/lib/prisma/queries'
import { cn } from '@/lib/utils'

import { likeStamp } from './actions'

type LikeButtonProps = {
  id: StampWithRelations['id']
  initialLikes: number
}

export const StampLikeButton = ({ id, initialLikes }: LikeButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useSession()
  const isUserAuth = status === 'authenticated'

  const { data: userData, mutate } = useSWR<{
    data?: UserWithStamps
    message: string
  }>(isUserAuth ? '/api/user' : null, (url: string) =>
    fetch(url).then((res) => res.json())
  )
  const isStampLiked =
    userData?.data?.likedStamps.some((stamp) => stamp.id === id) ?? false

  const [optimisticLikes, mutateOptimisticLike] = useOptimistic(
    {
      likes: initialLikes,
      isLiked: isStampLiked,
    },
    (state, action: 'add' | 'remove') => {
      switch (action) {
        case 'add':
          return {
            likes: state.likes + 1,
            isLiked: true,
          }
        case 'remove':
          return {
            likes: state.likes - 1,
            isLiked: false,
          }
        default:
          return state
      }
    }
  )

  const addLikeToStamp = async () => {
    if (!isUserAuth) {
      router.push(`/auth/signin?callbackUrl=${pathname}`)
    }
    if (isStampLiked || optimisticLikes.isLiked === true) {
      //TODO: cant unlike until debouncing / rate limiting implemented
      return
    }
    startTransition(() => {
      mutateOptimisticLike('add')
    })

    const res = await likeStamp(id)

    if (!res.ok) {
      mutateOptimisticLike('remove')
      return
    }

    mutate()
  }
  return (
    <Button
      data-testid="like-stamp"
      onClick={addLikeToStamp}
      plain
      className={cn(
        'cursor-pointer [&>[data-slot=icon]]:sm:size-6',
        isStampLiked && '[&>[data-slot=icon]]:sm:text-primary'
      )}
    >
      <HandThumbUpIcon data-testid="like-icon" />
      {isStampLiked ? initialLikes + 1 : initialLikes}
    </Button>
  )
}
