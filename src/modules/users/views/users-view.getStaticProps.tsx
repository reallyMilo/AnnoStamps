import type { GetStaticPaths, GetStaticProps } from 'next'

import { userIncludeStatement, UserWithStamps } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

export type UsernamePageProps = {
  stats: { downloads: number; likes: number }
  user: UserWithStamps
}
export const getStaticPaths = (() => {
  return {
    paths: [], // add content creators here to generate path at build time
    fallback: 'blocking',
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }) => {
  if (typeof params?.user !== 'string') {
    return {
      notFound: true,
    }
  }

  const user = await prisma.user.findFirst({
    include: userIncludeStatement,
    where: {
      OR: [{ usernameURL: params.user }, { id: params.user }],
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const stats = user.listedStamps.reduce(
    (acc, curr) => {
      return {
        downloads: acc.downloads + curr.downloads,
        likes: acc.likes + curr._count.likedBy,
      }
    },
    {
      downloads: 0,
      likes: 0,
    }
  )
  return {
    props: {
      user,
      stats,
    },
    revalidate: 86400, // update stats daily
  }
}) satisfies GetStaticProps<UsernamePageProps>
