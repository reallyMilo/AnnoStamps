import { unstable_cache } from 'next/cache'
import 'server-only'

import prisma from '@/lib/prisma/singleton'

export const getUser = unstable_cache(
  async (user: string) =>
    prisma.user.findFirst({
      include: {
        listedStamps: {
          include: {
            images: true,
          },
          take: 1,
        },
      },
      where: {
        OR: [{ usernameURL: user.toLowerCase() }, { id: user }],
      },
    }),
  ['getUser'],
  {
    revalidate: 3000,
    tags: ['getUser'],
  },
)

export const userMetadata = (
  {
    biography,
    listedStamps,
    username,
  }: NonNullable<Awaited<ReturnType<typeof getUser>>>,
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
