import 'swiper/css'
import 'swiper/css/navigation'

import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import { StampCategoryIcon } from '@/components/StampCategoryIcon'
import { buttonStyles, Container, Heading, Link } from '@/components/ui'
import { stampIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'
import { cn, distanceUnixTimeToNow } from '@/lib/utils'

import { CarouselImage } from './CarouselImage'
import { StampLikeButton } from './StampLikeButton'

const getStamp = unstable_cache(
  async (id: string) => {
    return prisma.stamp.findUnique({
      include: stampIncludeStatement,
      where: { id },
    })
  },
  ['getStamp'],
  { revalidate: 3600 },
)

const StampPage = async ({ params }: { params: { id: string } }) => {
  const stamp = await getStamp(params.id)
  const session = await auth()
  if (!stamp) {
    notFound()
  }
  const {
    id,
    title,
    category,
    region,
    markdownDescription,
    stampFileUrl,
    modded,
    good,
    downloads,
    images,
    user,
    _count: likes,
    createdAt,
    changedAt,
  } = stamp

  return (
    <Container className="max-w-5xl space-y-6 px-0">
      <CarouselImage images={images} />
      <div className="space-y-6 px-2 text-midnight sm:px-0 dark:text-white">
        <Heading className="truncate">{title} </Heading>

        <div className="flex items-center space-x-5">
          {user.usernameURL && (
            <Link className="hover:text-primary" href={`/${user.usernameURL}`}>
              {user.username}
            </Link>
          )}
          {modded && (
            <div className="flex w-fit items-center gap-1 rounded-full bg-accent py-1 pl-2 pr-3 text-xs capitalize text-white">
              <WrenchIcon className="h-5 w-5" />
              mods
            </div>
          )}
          <div className="hidden sm:block">
            <StampCategoryIcon category={category} />
          </div>

          <div className="hidden grow space-x-5 text-sm md:flex">
            <div className="capitalize text-accent dark:text-accent">
              {region}
            </div>

            {category === 'production' && (
              <div className="capitalize text-gray-500">{good}</div>
            )}

            {/* TODO: views */}
            {/* <div className="">
            <EyeIcon className="mr-2 inline-block h-5 w-5" /> Views
          </div> */}
            <div>
              <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
              <span data-testid="stamp-downloads">{downloads}</span>
            </div>

            <div suppressHydrationWarning>
              {distanceUnixTimeToNow(createdAt)}
            </div>
          </div>
          <SessionProvider session={session}>
            <StampLikeButton id={id} initialLikes={likes.likedBy} />
          </SessionProvider>

          <a
            href={stampFileUrl}
            data-testid="stamp-download"
            className={cn(
              buttonStyles.base,
              buttonStyles.solid,
              buttonStyles.colors.primary,
            )}
            download={title}
          >
            <ArrowDownTrayIcon />
            Download
          </a>
        </div>

        {createdAt !== changedAt && (
          <div className="italic" suppressHydrationWarning>
            Updated: {distanceUnixTimeToNow(changedAt)}
          </div>
        )}
        <div
          className="stamp-markdown-html-wrapper"
          dangerouslySetInnerHTML={{ __html: markdownDescription ?? '' }}
        ></div>
      </div>
    </Container>
  )
}

export default StampPage
