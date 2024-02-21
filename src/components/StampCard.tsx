import {
  ArrowDownTrayIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

import type { StampWithRelations } from '@/lib/prisma/queries'

import Category from './Category'

const StampCard = ({
  id,
  title,
  category,
  region,
  modded,
  imageUrl,
  downloads,
  images,
  user,
}: StampWithRelations) => {
  const srcUrl =
    images.length === 0
      ? imageUrl ?? 'https://placehold.co/250x250/png'
      : images[0].smallUrl ?? images[0].originalUrl

  return (
    <div className="rounded-lg bg-white shadow-md">
      <Link
        href={`/stamp/${id}`}
        prefetch={false}
        data-testid="stamp-card-link"
      >
        <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200">
          <Image
            src={srcUrl}
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
            <span className="absolute right-2 top-2 flex h-fit w-fit flex-row items-center rounded-full bg-[#6DD3C0] px-2 py-1 text-xs text-black">
              <WrenchIcon className="mr-1 h-3 w-3" />
              mods
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-col flex-nowrap gap-y-2 p-4">
        <Link href={`/stamp/${id}`} prefetch={false}>
          <h4 id="stamp-region" className=" text-[#B11E47]">
            {region}
          </h4>

          <h2
            id="stamp-title"
            className="line-clamp-2 min-h-[45px] w-full overflow-hidden text-ellipsis text-lg font-semibold leading-tight text-gray-700"
          >
            {title}
          </h2>
        </Link>

        {user?.username ? (
          <Link
            href={`/${user.usernameURL}`}
            prefetch={false}
            className="flex h-11 items-center gap-1 text-slate-500"
          >
            <UserCircleIcon className="h-4 w-4" />
            <span className="hover:text-sky-700">{user.username}</span>
          </Link>
        ) : (
          <Link href={`/stamp/${id}`} prefetch={false} className="h-11" />
        )}
        <Link href={`/stamp/${id}`} prefetch={false}>
          <div className="flex justify-between">
            <Category category={category} />
            <div className="flex items-end">
              <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5 self-center" />
              {downloads}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default StampCard
