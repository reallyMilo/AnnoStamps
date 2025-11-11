import type { Metadata } from 'next'

import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import { getCommentReplyThread } from '@prisma/client/sql'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'

import { LikeButton } from '@/components/LikeButton'
import { StampCategoryIcon } from '@/components/StampCategoryIcon'
import { buttonStyles, Container, Heading, Link, Text } from '@/components/ui'
import {
  type Comment,
  commentIncludeStatement,
  stampIncludeStatement,
  type StampWithRelations,
} from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'
import { cn } from '@/lib/utils'

import { CarouselImage } from './CarouselImage'
import { CommentItem } from './CommentItem'
import { CommentView } from './CommentView'
import { StampDownloadDisclaimer } from './StampDownloadDisclaimer'
import { ViewReplyButton } from './ViewReplyButton'

const getStamp = unstable_cache(
  async (id: StampWithRelations['id']) =>
    prisma.stamp.findUnique({
      include: stampIncludeStatement,
      where: { id },
    }),
  ['getStamp'],
  { revalidate: 3600 },
)

const getReplyThread = unstable_cache(
  async (parentId: NonNullable<Comment['parentId']>) =>
    prisma.$queryRawTyped(getCommentReplyThread(parentId)),
  ['getReplyThread'],
  { revalidate: 3600 },
)
const getCommentThread = unstable_cache(
  async (id: StampWithRelations['id']) =>
    prisma.comment.findMany({
      include: commentIncludeStatement,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        parentId: null,
        stampId: id,
      },
    }),
  ['getCommentThread'],
  { revalidate: 3600 },
)

export const generateMetadata = async (props: {
  params: Promise<{ id: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const stamp = await getStamp(params.id)

  return {
    description: `${stamp?.unsafeDescription}`,
    openGraph: {
      images: [`${stamp?.images[0].smallUrl ?? stamp?.images[0].originalUrl}`],
    },
    title: `${stamp?.title} | AnnoStamps`,
  }
}

const Comments = async ({ id: stampId }: Pick<StampWithRelations, 'id'>) => {
  const stampPromise = getStamp(stampId)
  const commentsPromise = getCommentThread(stampId)
  const [stamp, comments] = await Promise.all([stampPromise, commentsPromise])

  return (
    <>
      <Heading level={2}>{comments.length} Comments</Heading>
      <CommentView userIdToNotify={stamp!.user.id} />
      <ul className="space-y-3">
        {comments.map((comment) => {
          const replyThreadPromise = getReplyThread(comment.id)

          return (
            <CommentItem
              key={comment.id}
              {...comment}
              replyToUser={{
                id: comment.user.id,
                username: comment.user.username as string,
                usernameURL: comment.user.usernameURL as string,
              }}
            >
              <div className="ml-12">
                <ViewReplyButton
                  numReplies={comment._count.replies ?? 0}
                  replyThreadPromise={replyThreadPromise}
                />
              </div>
            </CommentItem>
          )
        })}
      </ul>
    </>
  )
}

const StampPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const stamp = await getStamp(params.id)
  if (!stamp) {
    notFound()
  }

  const {
    _count: likes,
    category,
    changedAt,
    changedAtReadable,
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
      <CarouselImage images={images} title={title} />
      <div className="text-midnight space-y-6 px-2 sm:px-0 dark:text-white">
        <Heading className="truncate">{title} </Heading>

        <div className="flex items-center space-x-5">
          <Link className="hover:text-primary" href={`/${user.usernameURL}`}>
            {user.username}
          </Link>

          {modded && (
            <div className="bg-accent flex w-fit items-center gap-1 rounded-full py-1 pr-3 pl-2 text-xs text-white capitalize">
              <WrenchIcon className="h-5 w-5" />
              mods
            </div>
          )}
          <div className="hidden sm:block">
            <StampCategoryIcon category={category} />
          </div>

          <div className="hidden grow space-x-5 text-sm md:flex">
            <Text className="text-accent capitalize dark:text-rose-400">
              {region}
            </Text>

            {category === 'production' && (
              <div className="text-gray-500 capitalize">{good}</div>
            )}

            <div>
              <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
              <span data-testid="stamp-downloads">{suffixDownloads}</span>
            </div>

            <div suppressHydrationWarning>{createdAt}</div>
          </div>

          <LikeButton initialLikes={likes.likedBy ?? 0} stampId={id} />

          <StampDownloadDisclaimer changedAt={changedAt}>
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
          </StampDownloadDisclaimer>
        </div>

        {createdAt !== changedAtReadable && (
          <div className="italic" suppressHydrationWarning>
            Updated: {changedAtReadable}
          </div>
        )}
        <div
          className="stamp-markdown-html-wrapper"
          dangerouslySetInnerHTML={{ __html: markdownDescription ?? '' }}
        ></div>
        <Suspense fallback={<Heading level={2}> Comments</Heading>}>
          <Comments id={id} />
        </Suspense>
      </div>
    </Container>
  )
}

export default StampPage
