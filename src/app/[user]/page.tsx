import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

import { UserHomePage } from './HomeView'
import { UserPublicPage } from './PublicView'

// export function generateStaticParams() {
//   return [] // add content creators here to generate path at build time
// }

const getUserWithStamps = unstable_cache(
  async (user: string) => {
    return prisma.user.findFirst({
      include: userIncludeStatement,
      where: {
        OR: [{ usernameURL: user.toLowerCase() }, { id: user }],
      },
    })
  },
  ['getUserWithStamps'],
  {
    tags: ['getUserWithStamps'],
    revalidate: 86400,
  }
)

const UserPage = async ({ params }: { params: { user: string } }) => {
  const session = await auth()

  const user = await getUserWithStamps(params.user)

  if (!user) {
    notFound()
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

  return user.id === session?.user.id ? (
    <UserHomePage user={user} stats={stats} />
  ) : (
    <UserPublicPage user={user} stats={stats} />
  )
}

export default UserPage
