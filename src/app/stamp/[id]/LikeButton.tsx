'use client'
import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

import { StampWithRelations } from '@/lib/prisma/queries'
import { cn } from '@/lib/utils'

type LikeButtonProps = Pick<StampWithRelations, 'likedBy' | 'id'>

const LikeButton = ({ id, likedBy }: LikeButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  //RSC: auth
  // const { data: session } = useSession()
  const authUser = null
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
      router.push(`/auth/signin?callbackUrl=${pathname}`)
    }

    const { ok } = await trigger()
    if (!ok) {
      return
    }
    setIsLiked(true)
  }

  const isStampLiked = () => {
    if (likedBy.length === 0 || !authUser) return false
    //    if (likedBy.some((liked) => liked.id === authUser.id)) return true
    return false
  }

  return (
    <button
      onClick={addLikeToStamp}
      className="flex cursor-pointer items-center gap-1 text-sm"
    >
      <HandThumbUpIcon
        className={cn(
          'h-6 w-6',
          (isStampLiked() || isLiked) && 'text-[#6DD3C0]'
        )}
      />
      {likeStamp?.stamp ? likeStamp.stamp.likedBy.length : likedBy.length}
    </button>
  )
}

export default LikeButton
