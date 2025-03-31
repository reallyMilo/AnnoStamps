import { unstable_cache } from 'next/cache'
import 'server-only'

import { userIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'

export const getUserWithStamps = unstable_cache(
  async (user: string, game = '117') =>
    prisma.user.findFirst({
      include: userIncludeStatement(game),
      where: {
        OR: [{ usernameURL: user.toLowerCase() }, { id: user }],
      },
    }),
  ['getUserWithStamps'],
  {
    revalidate: 900,
    tags: ['getUserWithStamps'],
  },
)

export const userMetadata = (
  {
    biography,
    listedStamps,
    username,
  }: NonNullable<Awaited<ReturnType<typeof getUserWithStamps>>>,
  game = '117',
) => {
  const title = `${username} ${game} | AnnoStamps`
  const description = biography ?? `${username} AnnoStamps page`

  if (listedStamps.length === 0) {
    return {
      description,
      title,
    }
  }
  return {
    description,
    openGraph: {
      images: [
        listedStamps[0].images[0].smallUrl ??
          listedStamps[0].images[0].originalUrl,
      ],
    },
    title,
  }
}
