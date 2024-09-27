import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import { Prisma } from '@prisma/client'
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
  type Comment,
  commentIncludeStatement,
  stampIncludeStatement,
  type StampWithRelations,
  userIncludeStatement,
  type UserWithStamps,
} from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'
import { cn } from '@/lib/utils'

import { likeMutation } from './actions'
import { CarouselImage } from './CarouselImage'
import { CommentItem } from './CommentItem'
import { CommentView } from './CommentView'
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
//FIXME: use prisma typed query after deploying all migrations
const getReplyThread = unstable_cache(
  async (parentId: Comment['parentId']) =>
    prisma.$queryRaw(Prisma.sql`WITH RECURSIVE comment_tree AS (
    SELECT 
        c.id,
        c.content,
        c."userId",
        c."stampId",
        c."parentId",
        EXTRACT(EPOCH FROM c."createdAt") AS "createdAt",
        EXTRACT(EPOCH FROM c."updatedAt") AS "updatedAt",
        0 AS level,
        json_build_object(
            'username', u.username,
            'usernameURL', u."usernameURL",
            'image', u.image
        ) AS user,
        json_build_object(
            'id', parent_u.id,
            'username', parent_u.username,
            'usernameURL', parent_u."usernameURL"
        ) AS "replyToUser"
    FROM 
        "Comment" c
	  JOIN "User" u ON c."userId" = u.id
    LEFT JOIN "Comment" parent_c ON c."parentId" = parent_c.id  
    LEFT JOIN "User" parent_u ON parent_c."userId" = parent_u.id
    WHERE 
        c.id = ${parentId}

    UNION ALL

    SELECT 
        c.id,
        c.content,
        c."userId",
        c."stampId",
        c."parentId",
        EXTRACT(EPOCH FROM c."createdAt") AS "createdAt",
        EXTRACT(EPOCH FROM c."updatedAt") AS "updatedAt",
        ct.level + 1,
        json_build_object(
            'username', u.username,
            'usernameURL', u."usernameURL",
            'image', u.image
        ) AS user,
        json_build_object(
            'id', parent_u.id,
            'username', parent_u.username,
            'usernameURL', parent_u."usernameURL"
        ) AS "replyToUser"
    FROM "Comment" c
	  JOIN "User" u ON c."userId" = u.id
    LEFT JOIN "Comment" parent_c ON c."parentId" = parent_c.id  
    LEFT JOIN "User" parent_u ON parent_c."userId" = parent_u.id
    JOIN comment_tree ct ON c."parentId" = ct.id
)
SELECT * FROM comment_tree
ORDER BY "createdAt"`),
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

const Comments = async ({ id: stampId }: Pick<StampWithRelations, 'id'>) => {
  const session = await auth()
  const stampPromise = getStamp(stampId)
  const commentsPromise = getCommentThread(stampId)
  const [stamp, comments] = await Promise.all([stampPromise, commentsPromise])

  return (
    <>
      <Heading level={2}>{comments.length} Comments</Heading>
      <SessionProvider session={session}>
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
                    //@ts-expect-error type
                    replyThreadPromise={replyThreadPromise}
                  />
                </div>
              </CommentItem>
            )
          })}
        </ul>
      </SessionProvider>
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
        <Suspense fallback={<Heading level={2}> Comments</Heading>}>
          <Comments id={id} />
        </Suspense>
      </div>
    </Container>
  )
}

export default StampPage
