'use client'

import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { startTransition, useOptimistic } from 'react'

import { Button } from '@/components/ui'
import type { StampWithRelations } from '@/lib/prisma/models'
import { cn } from '@/lib/utils'

import { likeMutation } from './actions'

type LikeButtonProps = {
  id: StampWithRelations['id']
  initialLikes: number
  isLiked: boolean
}

export const StampLikeButton = ({
  id,
  initialLikes,
  isLiked,
}: LikeButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useSession()
  const isUserAuth = status === 'authenticated'

  const [optimisticLike, mutateOptimisticLike] = useOptimistic(
    {
      isLiked,
      likeCount: initialLikes,
    },
    (state, action: 'add' | 'remove') => {
      switch (action) {
        case 'add':
          return { isLiked: true, likeCount: state.likeCount + 1 }
        case 'remove':
          return {
            isLiked: false,
            likeCount: state.likeCount - 1,
          }
        default:
          return state
      }
    },
  )

  const addLikeToStamp = async () => {
    if (!isUserAuth) {
      router.push(`/auth/signin?callbackUrl=${pathname}`)
    }
    if (isLiked && optimisticLike) {
      //TODO: cant unlike until debouncing / rate limiting implemented
      return
    }

    startTransition(() => {
      mutateOptimisticLike('add')
    })
    const res = await likeMutation(id)

    if (!res.ok) {
      return
    }
  }
  return (
    <Button
      data-testid="like-stamp"
      onClick={addLikeToStamp}
      plain
      className={cn(
        'cursor-pointer [&>[data-slot=icon]]:sm:size-6',
        optimisticLike.isLiked && '[&>[data-slot=icon]]:sm:text-primary',
      )}
    >
      <HandThumbUpIcon data-testid="like-icon" />
      {optimisticLike.likeCount}
    </Button>
  )
}
