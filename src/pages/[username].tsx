import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { userIncludeStatement, UserWithStamps } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

type UsernamePageProps = {
  stats: { downloads: number; likes: number }
  user: UserWithStamps
}

export const getServerSideProps: GetServerSideProps<
  UsernamePageProps
> = async ({ query, res }) => {
  const user = await prisma.user.findUnique({
    include: userIncludeStatement,
    where: { usernameURL: query.username as string },
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=59'
  )

  if (!user) {
    return {
      notFound: true,
    }
  }

  //FIXME: is rawSQL query with prisma better?

  const stats = user.listedStamps.reduce(
    (acc, curr) => {
      return {
        downloads: acc.downloads + curr.downloads,
        likes: acc.likes + curr.likedBy.length,
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
  }
}

const UsernamePage = ({
  user,
  stats,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container>
      <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
        <div className="flex space-x-4 ">
          <h1 className="text-3xl">{user?.username}</h1>
          <span className="self-end">{stats.downloads} Downloads</span>
          <span className="self-end">{stats.likes} Likes</span>
        </div>
        <p className="text-sm">{user?.biography}</p>
      </div>

      <Grid>
        {' '}
        {user.listedStamps.length === 0 ? (
          <p>User has no stamps</p>
        ) : (
          user?.listedStamps.map((stamp) => (
            <StampCard key={stamp.id} user={user} {...stamp} />
          ))
        )}
      </Grid>
    </Container>
  )
}

export default UsernamePage
