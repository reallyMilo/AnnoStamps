'use client'

import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { startTransition, useOptimistic } from 'react'

import type { StampWithRelations } from '@/lib/prisma/models'

import { Button } from '@/components/ui'
import { cn, type ServerAction } from '@/lib/utils'

type LikeButtonProps = {
  id: StampWithRelations['id']
  initialLikes: number
  isLiked: boolean
  likeButtonAction: ServerAction<StampWithRelations['id'], { ok: boolean }>
  testId: string
}

export const LikeButton = ({
  id,
  initialLikes,
  isLiked,
  likeButtonAction,
  testId,
}: LikeButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { status: userAuthStatus } = useSession()

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

  const addLike = async () => {
    if (userAuthStatus !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=${pathname}`)
      return
    }
    if (isLiked && optimisticLike) {
      //TODO: cant unlike until debouncing / rate limiting implemented
      return
    }

    startTransition(() => {
      mutateOptimisticLike('add')
    })
    const res = await likeButtonAction(id)

    if (!res.ok) {
      return
    }
  }
  return (
    <Button
      className={cn(
        'cursor-pointer sm:*:data-[slot=icon]:size-6',
        optimisticLike.isLiked && 'sm:*:data-[slot=icon]:text-primary',
      )}
      data-testid={testId}
      onClick={addLike}
      plain
    >
      <HandThumbUpIcon />
      {optimisticLike.likeCount}
    </Button>
  )
}
