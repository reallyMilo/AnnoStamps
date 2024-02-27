import { unstable_cache } from 'next/cache'

import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

export const getUserWithStamps = unstable_cache(
  async (id: string) => {
    return prisma.user.findUniqueOrThrow({
      include: userIncludeStatement,
      where: {
        id,
      },
    })
  },
  ['userStamps'],
  {
    tags: ['userStamps'],
  }
)
