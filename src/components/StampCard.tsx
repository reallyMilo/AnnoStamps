import { UserCircleIcon, WrenchIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

import type { StampWithRelations } from '@/lib/prisma/queries'

import Category from './Category'
import LikeButton from './LikeButton'

const StampCard = ({
  id,
  title,
  category,
  region,
  modded,
  imageUrl,
  collection,
  likedBy,
  images,
  user,
}: StampWithRelations) => {
  const { thumbnailUrl, originalUrl } = images[0] ?? {}
  const srcUrl = thumbnailUrl ?? originalUrl ?? imageUrl

  return (
    <article className="grid w-full grid-flow-row rounded-lg bg-white shadow-md">
      <Link href={`/stamp/${id}`} data-testid="stamp-card-link">
        <div className="relative">
          <div className="aspect-h-9 aspect-w-16 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200">
            <div>
              <Image
                src={srcUrl ?? 'https://placehold.co/250x250/png'}
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
          <li>
            <Category category={category} />
          </li>

          <li>
            <LikeButton id={id} likedBy={likedBy} />
          </li>
        </ol>
      </div>
    </article>
  )
}

export default StampCard
