// https://www.prisma.io/docs/concepts/@/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
import { Prisma } from '@prisma/client'

import { Category } from '@/lib/game/1800enum'

const stampWithLikes = Prisma.validator<Prisma.StampArgs>()({
  select: {
    id: true,
    title: true,
    description: true,
    imageUrl: true,
    stampFileUrl: true,
    category: true,
    region: true,
    modded: true,
    downloads: true,
    likedBy: {
      select: {
        id: true,
      },
    },
  },
})
type StampWithLikes = Prisma.StampGetPayload<typeof stampWithLikes>

const stampWithRelations = Prisma.validator<Prisma.StampArgs>()({
  select: {
    id: true,
    title: true,
    imageUrl: true,
    category: true,
    region: true,
    modded: true,
    likedBy: {
      select: {
        id: true,
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        usernameURL: true,
        image: true,
      },
    },
  },
})

type StampWithRelations = Prisma.StampGetPayload<typeof stampWithRelations>

const userWithListedStamps = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    username: true,
    usernameURL: true,
    image: true,
    discord: true,
    reddit: true,
    emailContact: true,
    twitch: true,
    twitter: true,
    biography: true,
    listedStamps: {
      select: {
        id: true,
        title: true,
        imageUrl: true,
        category: true,
        region: true,
        modded: true,
        likedBy: {
          select: {
            id: true,
          },
        },
      },
    },
  },
})
type UserWithListedStamps = Prisma.UserGetPayload<typeof userWithListedStamps>
interface CreateStamp extends Prisma.StampCreateInput {
  category: Category
}
