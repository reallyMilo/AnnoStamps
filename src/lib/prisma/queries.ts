import { Prisma } from '@prisma/client'
import { getUnixTime } from 'date-fns'
import z from 'zod'

import { CATEGORIES, REGIONS_1800 } from '@/lib/game/1800/data'

//Exception: you cannot mutate include or select because that would change the
//expected output type and break type safety. Will have to keep exporting this
//unfortunately or every statement call would have to be cast
export const stampIncludeStatement = {
  user: true,
  likedBy: true,
  images: true,
} satisfies Prisma.StampInclude

export interface StampWithRelations
  extends Omit<
    Prisma.StampGetPayload<{
      include: typeof stampIncludeStatement
    }>,
    'createdAt' | 'updatedAt' | 'images' | 'changedAt'
  > {
  changedAt: number
  createdAt: number
  images: Image[]
  updatedAt: number
}

const stampSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  category: z.nativeEnum(CATEGORIES),
  region: z.nativeEnum(REGIONS_1800),
  game: z.enum(['1800']),
  good: z.string().optional(),
  capital: z.string().optional(),
  collection: z.string().optional(),
  downloads: z.object({ increment: z.number() }).optional(),
  modded: z.string(),
  imageUrl: z.string().optional(),
  stampFileUrl: z.string(),
  images: z.object({
    create: z.array(
      z.object({
        id: z.string(),
        originalUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        smallUrl: z.string().optional(),
        mediumUrl: z.string().optional(),
        largeUrl: z.string().optional(),
      })
    ),
  }),
  likedBy: z
    .object({
      connect: z.object({
        id: z.string(),
      }),
    })
    .optional(),
})

const createStampSchema = stampSchema
  .omit({ downloads: true, likedBy: true })
  .transform(({ modded, collection, ...schema }) => ({
    modded: modded === 'true',
    collection: collection === 'true',
    ...schema,
  })) satisfies z.Schema<
  Prisma.StampUncheckedCreateInput,
  z.ZodTypeDef,
  Omit<Prisma.StampUncheckedCreateInput, 'modded' | 'collection'> & {
    collection?: string
    modded: string
  }
>

const updateStampSchema = stampSchema
  .omit({ id: true, userId: true, game: true })
  .partial({ images: true })
  .extend({ changedAt: z.string().datetime() })
  .transform(({ modded, collection, ...schema }) => ({
    modded: modded === 'true',
    collection: collection === 'true',
    ...schema,
  })) satisfies z.Schema<
  Prisma.StampUncheckedUpdateInput,
  z.ZodTypeDef,
  Omit<Prisma.StampUncheckedUpdateInput, 'modded' | 'collection'> & {
    collection?: string
    modded?: string
  }
>

export const stampExtensions = Prisma.defineExtension({
  query: {
    stamp: {
      create({ args, query }) {
        args.data = createStampSchema.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = updateStampSchema.parse(args.data)
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
      changedAt: {
        compute({ changedAt }) {
          return getUnixTime(new Date(changedAt))
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * User
 * -----------------------------------------------------------------------------------------------*/
export const userIncludeStatement = {
  listedStamps: {
    include: {
      likedBy: true,
      images: true,
    },
  },
} satisfies Prisma.UserInclude

export interface UserWithStamps
  extends Omit<
    Prisma.UserGetPayload<{
      include: typeof userIncludeStatement
    }>,
    'listedStamps'
  > {
  listedStamps: Omit<StampWithRelations, 'user'>[]
}

const userProfileSchema = z
  .object({
    username: z.string().regex(/^[a-zA-Z0-9_\\-]+$/),
    usernameURL: z.string(),
    biography: z.string(),
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
      name: {
        compute() {
          return null
        },
      },
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

export type Image = Omit<
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
