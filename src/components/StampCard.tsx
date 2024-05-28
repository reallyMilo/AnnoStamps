import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

import { StampCategoryIcon } from '@/components/StampCategoryIcon'
import { Avatar, Heading, Subheading } from '@/components/ui'
import type { StampWithRelations } from '@/lib/prisma/queries'
import { distanceUnixTimeToNow } from '@/lib/utils'

export const StampCard = ({
  id,
  title,
  category,
  region,
  modded,
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
  | 'downloads'
  | 'images'
  | 'user'
  | 'createdAt'
>) => {
  const srcUrl = images[0]?.smallUrl ?? images[0].originalUrl

  return (
    <div className="group relative flex flex-col rounded-lg bg-white shadow-md dark:bg-zinc-800">
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

      <div className="flex h-full flex-col gap-y-2 p-4">
        <div className="flex items-baseline justify-between">
          <Subheading
            id="stamp-region"
            level={4}
            className="text-sm capitalize text-accent dark:text-accent"
          >
            {region}
          </Subheading>
          <div
            className="text-sm text-midnight dark:text-white"
            suppressHydrationWarning
          >
            {distanceUnixTimeToNow(createdAt)}
          </div>
        </div>
        <Heading
          level={2}
          id="stamp-title"
          className="line-clamp-2 min-h-[45px] w-full overflow-hidden text-ellipsis"
        >
          <Link
            href={`/stamp/${id}`}
            data-testid="stamp-card-link"
            prefetch={false}
          >
            <span aria-hidden="true" className="absolute inset-0"></span>
            {title}
          </Link>
        </Heading>

        {user?.username ? (
          <Link
            href={`/${user.usernameURL}`}
            className="z-10 flex h-11 w-fit items-center gap-1 text-slate-500 hover:text-primary  dark:text-white"
            prefetch={false}
          >
            <Avatar src={user.image} className="size-5" />
            {user.username}
          </Link>
        ) : (
          <span className="h-11"></span>
        )}

        <div className="mt-auto flex justify-between">
          <StampCategoryIcon category={category} />
          <div className="flex items-end text-midnight dark:text-white">
            <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5 self-center" />
            <span data-testid="stamp-card-downloads">{downloads}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
