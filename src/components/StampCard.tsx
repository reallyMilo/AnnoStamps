import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

import type { StampWithRelations } from '@/lib/prisma/models'

import { StampCategoryIcon } from '@/components/StampCategoryIcon'
import { Avatar, Heading, Text } from '@/components/ui'

export const StampCard = ({
  category,
  createdAt,
  id,
  images,
  modded,
  region,
  suffixDownloads,
  title,
  user,
}: Pick<
  StampWithRelations,
  | 'category'
  | 'createdAt'
  | 'id'
  | 'images'
  | 'modded'
  | 'region'
  | 'suffixDownloads'
  | 'title'
  | 'user'
>) => {
  const srcUrl = images[0]?.smallUrl ?? images[0].originalUrl

  return (
    <div className="group relative flex flex-col rounded-lg bg-white shadow-md dark:bg-zinc-800">
      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200 group-hover:opacity-75">
        <img
          alt={title ?? 'image alt'}
          className="transition hover:opacity-80"
          sizes="(max-width: 320px) 700px
                (max-width: 768px) 390px,
                (max-width: 1200px) 290px"
          src={srcUrl}
          style={{
            objectFit: 'cover',
          }}
        />
        {modded && (
          <div className="bg-accent text-default absolute top-2 right-2 ml-auto flex h-fit w-fit flex-row items-center rounded-full px-2 py-1 text-xs">
            <WrenchIcon className="mr-1 h-3 w-3" />
            mods
          </div>
        )}
      </div>

      <div className="flex h-full min-h-[200px] flex-col gap-y-2 px-3 py-2">
        <div className="flex items-baseline justify-between">
          <Text
            className="text-accent font-semibold capitalize dark:text-rose-400"
            id="stamp-region"
          >
            {region}
          </Text>
          <Text
            className="text-midnight dark:text-white"
            suppressHydrationWarning
          >
            {createdAt}
          </Text>
        </div>
        <Heading
          className="line-clamp-2 w-full grow overflow-hidden text-ellipsis"
          id="stamp-title"
          level={2}
        >
          <Link
            data-testid="stamp-card-link"
            href={`/stamp/${id}`}
            prefetch={false}
          >
            <span aria-hidden="true" className="absolute inset-0"></span>
            {title}
          </Link>
        </Heading>

        {user?.username ? (
          <Link
            className="hover:text-primary z-10 flex h-11 w-fit items-center gap-1 text-slate-500 dark:text-white"
            data-testid="stamp-card-username-link"
            href={`/${user.usernameURL}`}
            prefetch={false}
          >
            <Avatar className="size-5" src={user.image} />
            {user.username}
          </Link>
        ) : (
          <span className="h-11"></span>
        )}

        <div className="mt-auto flex justify-between">
          <StampCategoryIcon category={category} />
          <div className="text-midnight flex items-end dark:text-white">
            <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5 self-center" />
            <span data-testid="stamp-card-downloads">{suffixDownloads}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const StampCardSkeleton = () => {
  return (
    <div className="group relative flex animate-pulse flex-col rounded-lg bg-white shadow-md dark:bg-zinc-800">
      <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200 group-hover:opacity-75"></div>

      <div className="flex h-full min-h-[200px] flex-col gap-y-2 px-3 py-2">
        <div className="flex items-baseline justify-between"></div>
        <div className="line-clamp-2 w-full grow overflow-hidden text-ellipsis"></div>

        <span className="h-11"></span>

        <div className="mt-auto flex justify-between"></div>
      </div>
    </div>
  )
}
