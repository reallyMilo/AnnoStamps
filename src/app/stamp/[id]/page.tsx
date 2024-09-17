import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import { SessionProvider } from 'next-auth/react'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'

import { auth } from '@/auth'
import { LikeButton } from '@/components/LikeButton'
import { StampCategoryIcon } from '@/components/StampCategoryIcon'
import { buttonStyles, Container, Heading, Link, Text } from '@/components/ui'
import {
  stampIncludeStatement,
  type StampWithRelations,
  userIncludeStatement,
  type UserWithStamps,
} from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'
import { cn } from '@/lib/utils'

import { likeMutation } from './actions'
import { CarouselImage } from './CarouselImage'
import { CommentThread } from './CommentThread'

const getStamp = unstable_cache(
  async (id: string) =>
    prisma.stamp.findUnique({
      include: stampIncludeStatement,
      where: { id },
    }),
  ['getStamp'],
  { revalidate: 3600 },
)

const getUserLikedStamp = unstable_cache(
  async (userId: UserWithStamps['id'], id: StampWithRelations['id']) =>
    prisma.user.findUnique({
      include: userIncludeStatement,
      where: {
        id: userId,
        likedStamps: {
          some: {
            id,
          },
        },
      },
    }),
  ['getUserLikedStamp'],
)

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}) => {
  const stamp = await getStamp(params.id)

  return {
    openGraph: {
      images: [`${stamp?.images[0].smallUrl ?? stamp?.images[0].originalUrl}`],
    },
    title: `${stamp?.title}`,
  }
}

const Comments = async ({ id }: Pick<StampWithRelations, 'id'>) => {
  const stamp = await getStamp(id)

  const { comments } = stamp!

  return (
    <>
      <Heading level={2}>Comments</Heading>

      <CommentThread comments={comments} id={id} />

      {/* <Link href={`/auth/signin?callbackUrl=/stamp/${id}`}>
          <Text className="underline">Login to comment</Text>
        </Link> */}
    </>
  )
}
const StampLikeButton = async ({ id }: Pick<StampWithRelations, 'id'>) => {
  const session = await auth()
  const stamp = await getStamp(id)

  let userLikes = null
  if (session) {
    userLikes = await getUserLikedStamp(session.userId, id)
  }

  return (
    <SessionProvider session={session}>
      <LikeButton
        id={id}
        initialLikes={stamp?._count.likedBy ?? 0}
        isLiked={!!userLikes}
        likeButtonAction={likeMutation}
        testId="like-stamp"
      />
    </SessionProvider>
  )
}

const StampPage = async ({ params }: { params: { id: string } }) => {
  const stamp = await getStamp(params.id)
  if (!stamp) {
    notFound()
  }

  const {
    _count: likes,
    category,
    changedAt,
    createdAt,
    good,
    id,
    images,
    markdownDescription,
    modded,
    region,
    stampFileUrl,
    suffixDownloads,
    title,
    user,
  } = stamp

  return (
    <Container className="max-w-5xl space-y-6 px-0 pb-24">
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
            <Text className="capitalize text-accent dark:text-rose-400">
              {region}
            </Text>

            {category === 'production' && (
              <div className="capitalize text-gray-500">{good}</div>
            )}

            <div>
              <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
              <span data-testid="stamp-downloads">{suffixDownloads}</span>
            </div>

            <div suppressHydrationWarning>{createdAt}</div>
          </div>
          <Suspense
            fallback={
              <SessionProvider session={null}>
                <LikeButton
                  id={id}
                  initialLikes={likes.likedBy ?? 0}
                  isLiked={false}
                  likeButtonAction={likeMutation}
                  testId="like-stamp"
                />
              </SessionProvider>
            }
          >
            <StampLikeButton id={params.id} />
          </Suspense>

          <a
            className={cn(
              buttonStyles.base,
              buttonStyles.solid,
              buttonStyles.colors.primary,
            )}
            data-testid="stamp-download"
            download={title}
            href={stampFileUrl}
          >
            <ArrowDownTrayIcon />
            Download
          </a>
        </div>

        {createdAt !== changedAt && (
          <div className="italic" suppressHydrationWarning>
            Updated: {changedAt}
          </div>
        )}
        <div
          className="stamp-markdown-html-wrapper"
          dangerouslySetInnerHTML={{ __html: markdownDescription ?? '' }}
        ></div>
      </div>
      <Comments id={id} />
    </Container>
  )
}

export default StampPage
