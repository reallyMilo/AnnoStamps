import {
  CogIcon,
  GlobeEuropeAfricaIcon,
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

import type { StampWithRelations } from '@/lib/prisma/queries'
import { cn, displayAuthModal, sendRequest } from '@/lib/utils'

type CategoryInfo = {
  color: string
  icon: React.ReactNode
}

const categoryMap: Record<string, CategoryInfo> = {
  housing: { icon: <HomeIcon className="h-5 w-5" />, color: 'bg-[#8B6834]' },
  production: { icon: <CogIcon className="h-5 w-5" />, color: 'bg-[#18806D]' },
  cosmetic: {
    icon: <SparklesIcon className="h-5 w-5" />,
    color: 'bg-[#C34E27]',
  },
  island: {
    icon: <GlobeEuropeAfricaIcon className="h-5 w-5" />,
    color: 'bg-[#2B4162]',
  },
  general: { icon: <TagIcon className="h-5 w-5" />, color: 'bg-[#D72455]' },
}

const StampCard = ({
  id,
  title,
  category,
  region,
  modded,
  collection,
  likedBy,
  images,
  user,
}: StampWithRelations) => {
  const likes = likedBy ? likedBy.length : 0
  const { data: session } = useSession()
  const authUser = session?.user
  const { data, trigger } = useSWRMutation('/api/stamp/like', sendRequest)
  const [isLiked, setIsLiked] = useState(false)
  const { thumbnailUrl, originalUrl } = images[0] ?? {}
  const { icon, color } = categoryMap[category ?? 'general']

  //TODO: Query user on likedStamps and see if stamp id exists
  const userLikedPost = () => {
    if (!likedBy || !authUser) return false
    if (likedBy.some((liked) => liked.id === authUser.id)) return true
    return false
  }

  const addLikeToStamp = async () => {
    if (!authUser) return displayAuthModal()

    await trigger(JSON.stringify({ stampId: id, userId: authUser.id }))
    setIsLiked(true)
  }

  return (
    <article className="grid w-full grid-flow-row rounded-lg bg-white shadow-md">
      <Link href={`/stamp/${id}`} data-testid="stamp-card-link">
        <div className="relative">
          <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200">
            <div>
              <Image
                src={thumbnailUrl ?? originalUrl}
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
          </div>
        </div>
        <div className="flex flex-col flex-nowrap p-4">
          <div className="flex justify-between">
            <span
              id="stamp-region"
              className="pb-2 text-sm capitalize text-[#B11E47]"
            >
              {region}
            </span>
            {collection && (
              <span className="flex w-fit items-center gap-1 rounded-full bg-[#6DD3C0] py-1 pl-2 pr-3 text-xs capitalize text-black">
                Collection
              </span>
            )}
          </div>

          <h2
            id="stamp-title"
            className="mt-2 w-full text-lg font-semibold leading-tight text-gray-700"
          >
            {title}
          </h2>
        </div>
      </Link>
      {user?.username && (
        <Link
          href={`/${user.usernameURL}`}
          className="flex items-center gap-1 p-4 py-2 text-slate-500"
        >
          <UserCircleIcon className="h-4 w-4" />
          <span className="hover:text-sky-700">{user.username}</span>
        </Link>
      )}
      <div className="flex flex-col flex-nowrap self-end p-4">
        <ol className="relative flex flex-row justify-between pt-4 text-gray-500">
          <li
            className={cn(
              'flex w-fit items-center gap-1 rounded-full py-1 pl-2 pr-3 text-xs capitalize text-white',
              color
            )}
          >
            {icon}
            {category}
          </li>

          <li
            data-testid="stamp-card-like"
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
    </article>
  )
}

export default StampCard
