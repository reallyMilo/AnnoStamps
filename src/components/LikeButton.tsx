import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import { StampWithRelations, UserWithStamps } from '@/lib/prisma/queries'
import { cn } from '@/lib/utils'

type LikeButtonProps = {
  id: StampWithRelations['id']
  initialLikes: number
}

const LikeButton = ({ id, initialLikes }: LikeButtonProps) => {
  const router = useRouter()
  const { status } = useSession()
  const isUserAuth = status === 'authenticated'
  const { data: userData, mutate } = useSWR<{
    data?: UserWithStamps
    message: string
  }>(isUserAuth ? '/api/user' : null, (url) =>
    fetch(url).then((res) => res.json())
  )

  const isStampLiked =
    userData?.data?.likedStamps.some((stamp) => stamp.id === id) ?? false
  const addLikeToStamp = async () => {
    if (!isUserAuth) {
      router.push({
        pathname: '/auth/signin',
        query: { callbackUrl: router.asPath },
      })
      return
    }
    if (isStampLiked) {
      //TODO: cant unlike until debouncing / rate limiting implemented
      return
    }
    const res = await fetch(`/api/stamp/like/${id}`, {
      method: 'PUT',
    })
    if (!res.ok) {
      return
    }

    userData?.data?.likedStamps.push({ id })
    mutate(userData)
  }
  return (
    <button
      data-testid="like-stamp"
      onClick={addLikeToStamp}
      className="flex cursor-pointer items-center gap-1 text-sm"
    >
      <HandThumbUpIcon
        data-testid="like-icon"
        className={cn('size-6', isStampLiked && 'text-primary')}
      />
      {isStampLiked ? initialLikes + 1 : initialLikes}
    </button>
  )
}

export default LikeButton
