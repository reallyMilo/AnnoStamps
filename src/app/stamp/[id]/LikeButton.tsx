'use client'
import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition, useOptimistic } from 'react'

import { StampWithRelations } from '@/lib/prisma/queries'
import { cn } from '@/lib/utils'

import { likeStamp } from './actions'

type LikeButtonProps = {
  id: StampWithRelations['id']
  initialLikes: number
  liked: boolean
}

const LikeButton = ({ id, initialLikes, liked }: LikeButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const [optimisticLikes, mutateOptimisticLike] = useOptimistic(
    {
      likes: initialLikes,
      isLiked: liked,
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

  const mutateLikes = async () => {
    //TODO: before we allow spamming likes need debounce / rate-limiting
    if (optimisticLikes.isLiked === true) {
      return
    }
    startTransition(() => {
      mutateOptimisticLike('add')
    })
    const stampLikes = await likeStamp(id)
    if (!stampLikes?.authenticated) {
      router.push(`/auth/signin?callbackUrl=${pathname}`)
    }
  }

  return (
    <button
      onClick={mutateLikes}
      className="flex cursor-pointer items-center gap-1 text-sm"
    >
      <HandThumbUpIcon
        className={cn('h-6 w-6', optimisticLikes.isLiked && 'text-[#6DD3C0]')}
      />
      {optimisticLikes.likes}
    </button>
  )
}

export default LikeButton
