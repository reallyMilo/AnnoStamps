'use client'
import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition, useOptimistic, useState } from 'react'

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
  const [likeState, setLikeState] = useState({
    likes: initialLikes,
    isLiked: liked,
  })
  const [optimisticLikes, mutateOptimisticLike] = useOptimistic(
    likeState,
    (state, newLikes: 'add' | 'remove') => {
      if (newLikes === 'remove') {
        return {
          isLiked: false,
          likes: state.likes - 1,
        }
      }
      return {
        isLiked: true,
        likes: state.likes + 1,
      }
    }
  )

  const mutateLikes = async () => {
    //TODO: before we allow spamming likes need debounce / rate-limiting
    if (likeState.isLiked === true) {
      return
    }
    startTransition(() => {
      mutateOptimisticLike('add')
    })
    const stampLikes = await likeStamp(id)
    if (!stampLikes?.authenticated) {
      router.push(`/auth/signin?callbackUrl=${pathname}`)
    }
    setLikeState({ likes: stampLikes.likes, isLiked: true })
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
