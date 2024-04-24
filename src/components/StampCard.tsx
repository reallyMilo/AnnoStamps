import {
  ArrowDownTrayIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

import type { StampWithRelations } from '@/lib/prisma/queries'
import { distanceUnixTimeToNow } from '@/lib/utils'

import StampCategoryIcon from './StampCategoryIcon'

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
  createdAt,
}: Pick<
  StampWithRelations,
  | 'id'
  | 'title'
  | 'category'
  | 'region'
  | 'modded'
  | 'imageUrl'
  | 'downloads'
  | 'images'
  | 'user'
  | 'createdAt'
>) => {
  const srcUrl =
    images.length === 0
      ? imageUrl ?? 'https://placehold.co/250x250/png'
      : images[0].smallUrl ?? images[0].originalUrl

  return (
    <div className="group relative rounded-lg bg-white shadow-md">
      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200 group-hover:opacity-75 ">
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
          <div className="absolute right-2 top-2 ml-auto flex h-fit w-fit flex-row items-center rounded-full bg-accent px-2 py-1 text-xs text-default">
            <WrenchIcon className="mr-1 h-3 w-3" />
            mods
          </div>
        )}
      </div>

      <div className="flex flex-col flex-nowrap gap-y-2 p-4">
        <div className="flex items-baseline justify-between">
          <h4 id="stamp-region" className="text-sm capitalize text-accent">
            {region}
          </h4>
          <div className="text-sm" suppressHydrationWarning>
            {distanceUnixTimeToNow(createdAt)}
          </div>
        </div>
        <h2
          id="stamp-title"
          className="line-clamp-2 min-h-[45px] w-full overflow-hidden text-ellipsis text-lg font-semibold leading-tight text-gray-700"
        >
          <Link
            href={`/stamp/${id}`}
            data-testid="stamp-card-link"
            prefetch={false}
          >
            <span aria-hidden="true" className="absolute inset-0"></span>
            {title}
          </Link>
        </h2>

        {user?.username ? (
          <Link
            href={`/${user.usernameURL}`}
            className="z-10 flex h-11 w-fit items-center gap-1 text-slate-500 hover:text-sky-700"
            prefetch={false}
          >
            <UserCircleIcon className="h-4 w-4" />
            {user.username}
          </Link>
        ) : (
          <span className="inline-block"></span>
        )}

        <div className="flex justify-between">
          <StampCategoryIcon category={category} />
          <div className="flex items-end">
            <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5 self-center" />
            <span data-testid="stamp-card-downloads">{downloads}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StampCard
