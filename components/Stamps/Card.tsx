import {
  CogIcon,
  HandThumbUpIcon,
  HomeIcon,
  SparklesIcon,
  TagIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid'
import type { User } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import type { StampWithLikes } from 'types'

import { cn } from '@/lib/utils'

const Card = ({
  id = '',
  screenshot = '',
  title = '',
  category = '',
  region = '',
  modded = false,
  liked,
  likes,
}: StampWithLikes) => {
  const likedBy = new Set(likes?.users)
  const { data: session } = useSession()
  const user = session?.user as User
  const [isLiked, setIsLiked] = useState(likedBy.has(user?.email))

  const addToUsersVoted = () => {
    if (!user) return // modal here to login!
    setIsLiked(true)

    axios.post('/api/likes', { stampId: id })
  }

  let icon
  let categoryColour

  if (category === 'Housing') {
    icon = <HomeIcon className="h-3 w-3" />
    categoryColour = 'bg-[#8B6834]'
  }
  if (category === 'Production Chain') {
    icon = <CogIcon className="h-3 w-3" />
    categoryColour = 'bg-[#18806D]'
  }
  if (category === 'Farm') {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-3 w-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
        />
      </svg>
    )
    categoryColour = 'bg-[#515D8C]'
  }
  if (category === 'Cosmetic') {
    icon = <SparklesIcon className="h-3 w-3" />
    categoryColour = 'bg-[#C34E27]'
  }
  if (category === 'General') {
    icon = <TagIcon className="h-3 w-3" />
    categoryColour = 'bg-[#D72455]'
  }

  return (
    <>
      <div className=" grid w-full grid-flow-row grid-rows-2 rounded-lg bg-white shadow-md">
        <div className="relative">
          <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200">
            {screenshot && (
              <Link href={`/stamps/${id}`}>
                <Image
                  src={screenshot}
                  alt={title}
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
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-nowrap p-4">
          <p className="pb-2 text-sm text-[#B11E47]">{region}</p>

          <div className="mt-2 w-full text-lg font-semibold leading-tight text-gray-700">
            <Link href={`/stamps/${id}`}>{title ?? ''}</Link>
          </div>
          {user?.nickname && (
            <p className="flex items-center gap-1 py-2 text-xs text-slate-500">
              <UserCircleIcon className="h-4 w-4" />
              {user.nickname}
            </p>
          )}
          <ol className="relative bottom-0 mt-auto flex flex-row justify-between  pt-4 text-gray-500">
            <li
              className={`flex items-center gap-1 rounded-full ${categoryColour} w-fit py-1  pl-2 pr-3 text-xs text-white`}
            >
              {icon}
              {category ?? ''}
            </li>

            <li className="flex cursor-pointer items-center gap-1 text-sm">
              <HandThumbUpIcon
                className={cn('h-6 w-6', isLiked && 'text-[#6DD3C0]')}
                onClick={addToUsersVoted}
              />
              {liked}
            </li>
          </ol>
        </div>
      </div>
    </>
  )
}

export default Card
