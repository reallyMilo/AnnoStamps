import { Prisma } from '@prisma/client'
import { getUnixTime } from 'date-fns'
import z from 'zod'

import { Category, Region1800 } from '@/lib/game/1800/enum'

export const stampWithRelations = {
  user: true,
  likedBy: true,
  images: true,
} satisfies Prisma.StampInclude

export type StampWithRelations = Omit<
  Prisma.StampGetPayload<{
    include: typeof stampWithRelations
  }>,
  'createdAt' | 'updatedAt' | 'images'
> & {
  createdAt: number
  updatedAt: number
} & { images: Image[] }

const createStampSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    userId: z.string(),
    category: z.nativeEnum(Category),
    region: z.nativeEnum(Region1800),
    game: z.enum(['1800']),
    good: z.string().optional(),
    capital: z.string().optional(),
    townhall: z.string().optional(),
    tradeUnion: z.string().optional(),
    modded: z.string(),
    imageUrl: z.string().optional(),
    stampFileUrl: z.string(),
    images: z.object({
      create: z.array(
        z.object({
          originalUrl: z.string(),
          thumbnailUrl: z.string().optional(),
          smallUrl: z.string().optional(),
          mediumUrl: z.string().optional(),
          largeUrl: z.string().optional(),
        })
      ),
    }),
  })
  .transform(({ modded, tradeUnion, townhall, ...schema }) => ({
    modded: modded === 'true',
    tradeUnion: tradeUnion === 'true',
    townhall: townhall === 'true',
    ...schema,
  })) satisfies z.Schema<
  Prisma.StampUncheckedCreateInput,
  z.ZodTypeDef,
  Omit<
    Prisma.StampUncheckedCreateInput,
    'modded' | 'tradeUnion' | 'townhall'
  > & {
    modded: string
    townhall?: string
    tradeUnion?: string
  }
>

export const stampExtensions = Prisma.defineExtension({
  query: {
    stamp: {
      create({ args, query }) {
        args.data = createStampSchema.parse(args.data)
        return query(args)
      },
    },
  },
  result: {
    stamp: {
      createdAt: {
        compute({ createdAt }) {
          return getUnixTime(new Date(createdAt))
        },
      },
      updatedAt: {
        compute({ updatedAt }) {
          return getUnixTime(new Date(updatedAt))
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * User
 * -----------------------------------------------------------------------------------------------*/
export const userWithStamps = {
  listedStamps: {
    include: {
      likedBy: true,
      images: true,
    },
  },
} satisfies Prisma.UserInclude

export type UserWithStamps = Omit<
  Prisma.UserGetPayload<{
    include: typeof userWithStamps
  }>,
  'listedStamps'
> & { listedStamps: Omit<StampWithRelations, 'user'>[] }

const userProfileSchema = z
  .object({
    username: z.string().regex(/^[a-zA-Z0-9_\\-]+$/),
    usernameURL: z.string(),
    biography: z.string(),
    emailContact: z.string(),
    discord: z.string(),
    twitter: z.string(),
    reddit: z.string(),
    twitch: z.string(),
  })
  .partial() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>

export const userExtension = Prisma.defineExtension({
  query: {
    user: {
      update({ args, query }) {
        args.data = userProfileSchema.parse(args.data)
        return query(args)
      },
    },
  },
  result: {
    user: {
      email: {
        compute() {
          return null
        },
      },
      emailVerified: {
        compute() {
          return null
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * Image
 * -----------------------------------------------------------------------------------------------*/

type Image = Omit<
  Prisma.ImageGetPayload<Prisma.ImageDefaultArgs>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: number
  updatedAt: number
}
export const imageExtension = Prisma.defineExtension({
  result: {
    image: {
      createdAt: {
        compute({ createdAt }) {
          return getUnixTime(new Date(createdAt))
        },
      },
      updatedAt: {
        compute({ updatedAt }) {
          return getUnixTime(new Date(updatedAt))
        },
      },
    },
  },
})
