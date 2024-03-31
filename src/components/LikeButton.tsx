import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

import { StampWithRelations } from '@/lib/prisma/queries'
import { cn } from '@/lib/utils'

type LikeButtonProps = Pick<StampWithRelations, 'likedBy' | 'id'>

const LikeButton = ({ id, likedBy }: LikeButtonProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const authUser = session?.user
  const [isLiked, setIsLiked] = useState(false)

  const { data: likeStamp, trigger } = useSWRMutation(
    `/api/stamp/like/${id}`,
    async (
      url: string
    ): Promise<{
      message: string
      ok: boolean
      stamp?: StampWithRelations
    }> => {
      const res = await fetch(url, {
        method: 'PUT',
      })
      const json = await res.json()
      return json
    }
  )

  const addLikeToStamp = async () => {
    if (!authUser) {
      router.push({
        pathname: '/auth/signin',
        query: { callbackUrl: router.asPath },
      })
      return
    }

    const { ok } = await trigger()
    if (!ok) {
      return
    }
    setIsLiked(true)
  }

  const isStampLiked = () => {
    if (likedBy.length === 0 || !authUser) return false
    if (likedBy.some((liked) => liked.id === authUser.id)) return true
    return false
  }

  return (
    <button
      data-testid="like-stamp"
      onClick={addLikeToStamp}
      className="flex cursor-pointer items-center gap-1 text-sm"
    >
      <HandThumbUpIcon
        data-testid="like-icon"
        className={cn('h-6 w-6', (isStampLiked() || isLiked) && 'text-primary')}
      />
      {likeStamp?.stamp ? likeStamp.stamp.likedBy.length : likedBy.length}
    </button>
  )
}

export default LikeButton
