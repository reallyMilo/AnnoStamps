import { notFound } from 'next/navigation'

import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

const UsernamePage = async ({ params }: { params: { username: string } }) => {
  //RSC: https://nextjs.org/docs/app/building-your-application/caching
  const user = await prisma.user.findUnique({
    include: userIncludeStatement,
    where: { usernameURL: params.username },
  })

  if (!user) {
    notFound()
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
