import type { Metadata } from 'next'

import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { userIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'

import { UserHomePage } from './UserHomePage'
import { UserPublicPage } from './UserPublicPage'

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
    revalidate: 900,
    tags: ['getUserWithStamps'],
  },
)

export const generateMetadata = async ({
  params,
}: {
  params: { user: string }
}): Promise<Metadata> => {
  const user = await getUserWithStamps(params.user)
  if (!user) {
    return {}
  }
  return {
    description: user?.biography ?? `${params.user} AnnoStamps page`,
    openGraph: {
      images: [
        user.listedStamps[0].images[0].smallUrl ??
          user.listedStamps[0].images[0].originalUrl,
      ],
    },
    title: `${params.user} | AnnoStamps`,
  }
}

const UserPage = async ({ params }: { params: { user: string } }) => {
  const session = await auth()

  const user = await getUserWithStamps(params.user)

  if (!user) {
    notFound()
  }

  return user.id === session?.userId ? (
    <UserHomePage {...user} />
  ) : (
    <UserPublicPage {...user} />
  )
}

export default UserPage
