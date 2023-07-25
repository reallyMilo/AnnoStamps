import {
  CogIcon,
  HandThumbUpIcon,
  HomeIcon,
  SparklesIcon,
  TagIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import type { StampWithRelations } from 'types'

import { cn, sendRequest } from '@/lib/utils'

const StampCard = ({
  id,
  imageUrl,
  title,
  category,
  region,
  modded,
  likedBy,
  user,
}: Partial<StampWithRelations>) => {
  const likes = likedBy ? likedBy.length : 0
  const { data: session } = useSession()
  const authUser = session?.user

  //TODO: Query user on likedStamps and see if stamp id exists
  const userLikedPost = () => {
    if (!likedBy || !authUser) return false
    if (likedBy.some((liked) => liked.id === authUser.id)) return true
    return false
  }

  const { data, trigger } = useSWRMutation('/api/stamp/like', sendRequest)
  const [isLiked, setIsLiked] = useState(false)
  const addLikeToStamp = async () => {
    if (!authUser) return window.dispatchEvent(new Event('open-auth-modal'))

    await trigger({ stampId: id, userId: authUser.id })
    setIsLiked(true)
  }

  let icon
  let categoryColour

  if (category === 'housing') {
    icon = <HomeIcon className="h-5 w-5" />
    categoryColour = 'bg-[#8B6834]'
  }
  if (category === 'production') {
    icon = <CogIcon className="h-5 w-5" />
    categoryColour = 'bg-[#18806D]'
  }

  if (category === 'cosmetic') {
    icon = <SparklesIcon className="h-5 w-5" />
    categoryColour = 'bg-[#C34E27]'
  }
  if (category === 'general') {
    icon = <TagIcon className="h-5 w-5" />
    categoryColour = 'bg-[#D72455]'
  }

  return (
    <div className="grid w-full grid-flow-row rounded-lg bg-white shadow-md">
      <Link href={`/stamp/${id}`}>
        <div className="relative">
          <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200">
            {imageUrl && (
              <div>
                <Image
                  src={imageUrl}
                  alt={title ?? 'image alt'}
                  className="transition hover:opacity-80"
                  fill
                  sizes="(max-width: 320px) 700px
                (max-width: 768px) 390px,
                (max-width: 1200px) 290px"
                  style={{
                    objectFit: 'cover',
                  }}
                />
                {modded && (
                  <span className="absolute right-2 top-2 flex flex-row items-center rounded-full bg-[#6DD3C0] px-2 py-1 text-xs text-black">
                    <WrenchIcon className="mr-1 h-3 w-3" />
                    mods
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-nowrap p-4">
          <p className="pb-2 text-sm text-[#B11E47]">{region}</p>

          <div className="mt-2 w-full text-lg font-semibold leading-tight text-gray-700">
            {title}
          </div>

          {user?.nickname && (
            <p className="flex items-center gap-1 py-2 text-xs text-slate-500">
              <UserCircleIcon className="h-4 w-4" />
              {user.nickname}
            </p>
          )}
        </div>
      </Link>
      <div className="flex flex-col flex-nowrap self-end p-4">
        <ol className="relative flex flex-row justify-between pt-4 text-gray-500">
          <li
            className={`flex items-center gap-1 rounded-full capitalize ${categoryColour} w-fit py-1  pl-2 pr-3 text-xs text-white`}
          >
            {icon}
            {category}
          </li>

          <li
            onClick={addLikeToStamp}
            className="flex cursor-pointer items-center gap-1 text-sm"
          >
            <HandThumbUpIcon
              className={cn(
                'h-6 w-6',
                (userLikedPost() || isLiked) && 'text-[#6DD3C0]'
              )}
            />
            {data?.stamp ? data.stamp.likedBy.length : likes}
          </li>
        </ol>
      </div>
    </div>
  )
}

export default StampCard
