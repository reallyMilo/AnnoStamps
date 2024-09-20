import { Prisma } from '@prisma/client'
import { formatDistanceToNowStrict, getUnixTime } from 'date-fns'
import z from 'zod'

import { REGIONS_1800 } from '@/lib/constants/1800/data'

import { CATEGORIES } from '../constants'
import { distanceUnixTimeToNow, formatIntegerWithSuffix } from './utils'
//Exception: you cannot mutate include or select because that would change the
//expected output type and break type safety. Will have to keep exporting this
//unfortunately or every statement call would have to be cast
export const stampIncludeStatement = {
  _count: {
    select: {
      likedBy: true,
    },
  },
  comments: true,
  images: true,
  user: {
    select: {
      image: true,
      username: true,
      usernameURL: true,
    },
  },
} satisfies Prisma.StampInclude

export interface StampWithRelations
  extends Omit<
    Prisma.StampGetPayload<{
      include: typeof stampIncludeStatement
    }>,
    'changedAt' | 'comments' | 'createdAt' | 'images' | 'updatedAt'
  > {
  changedAt: string
  comments: Comment[]
  createdAt: string
  images: Image[]
  suffixDownloads: string
  updatedAt: string
}

const stampSchema = z.object({
  capital: z.string().optional(),
  category: z.nativeEnum(CATEGORIES),
  downloads: z.object({ increment: z.number() }).optional(),
  game: z.enum(['1800']),
  good: z.string().optional(),
  id: z.string(),
  images: z.object({
    create: z.array(
      z.object({
        id: z.string(),
        largeUrl: z.string().optional(),
        mediumUrl: z.string().optional(),
        originalUrl: z.string(),
        smallUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      }),
    ),
  }),
  imageUrl: z.string().optional(),
  likedBy: z
    .object({
      connect: z.object({
        id: z.string(),
      }),
    })
    .optional(),
  markdownDescription: z.string(),
  modded: z.string(),
  region: z.nativeEnum(REGIONS_1800),
  stampFileUrl: z.string(),
  title: z.string(),
  unsafeDescription: z.string(),
  userId: z.string(),
})

const createStampSchema = stampSchema
  .omit({ downloads: true, likedBy: true })
  .transform(({ modded, ...schema }) => ({
    modded: modded === 'true',
    ...schema,
  })) satisfies z.Schema<
  Prisma.StampUncheckedCreateInput,
  z.ZodTypeDef,
  {
    modded: string
  } & Omit<Prisma.StampUncheckedCreateInput, 'modded'>
>

const updateStampSchema = stampSchema
  .omit({ game: true, id: true, userId: true })
  .extend({ changedAt: z.string().datetime() })
  .partial()
  .transform(({ modded, ...schema }) => ({
    modded: modded === 'true',
    ...schema,
  })) satisfies z.Schema<
  Prisma.StampUncheckedUpdateInput,
  z.ZodTypeDef,
  {
    modded?: string
  } & Omit<Prisma.StampUncheckedUpdateInput, 'modded'>
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
      changedAt: {
        compute({ changedAt }) {
          return distanceUnixTimeToNow(getUnixTime(new Date(changedAt)))
        },
      },
      createdAt: {
        compute({ createdAt }) {
          return distanceUnixTimeToNow(getUnixTime(new Date(createdAt)))
        },
      },
      suffixDownloads: {
        compute({ downloads }) {
          return formatIntegerWithSuffix(downloads)
        },
        needs: { downloads: true },
      },
      updatedAt: {
        compute({ updatedAt }) {
          return distanceUnixTimeToNow(getUnixTime(new Date(updatedAt)))
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * User
 * -----------------------------------------------------------------------------------------------*/
export const userIncludeStatement = {
  likedStamps: {
    select: {
      id: true,
    },
  },
  listedStamps: {
    include: {
      _count: {
        select: {
          likedBy: true,
        },
      },
      images: true,
    },
    orderBy: {
      changedAt: 'desc',
    },
  },
} satisfies Prisma.UserInclude

export interface UserWithStamps
  extends Omit<
    Prisma.UserGetPayload<{
      include: typeof userIncludeStatement
    }>,
    'email' | 'emailVerified' | 'listedStamps' | 'name'
  > {
  email: null
  emailVerified: null
  listedStamps: ({
    _count: { likedBy: number }
  } & Omit<StampWithRelations, 'likedBy' | 'user'>)[]
  name: null
}

const userProfileSchema = z
  .object({
    biography: z.string(),
    username: z.string().regex(/^[a-zA-Z0-9_\\-]+$/),
    usernameURL: z.string(),
  })
  .partial() satisfies z.Schema<Prisma.UserUncheckedUpdateInput>

export const userExtension = Prisma.defineExtension({
  query: {
    user: {
      update({ args, query }) {
        args.data = userProfileSchema.passthrough().parse(args.data)
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
      name: {
        compute() {
          return null
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * Comments
 * -----------------------------------------------------------------------------------------------*/

export const commentIncludeStatement = {
  _count: {
    select: {
      replies: true,
    },
  },
  user: {
    select: {
      id: true,
      image: true,
      username: true,
      usernameURL: true,
    },
  },
} satisfies Prisma.CommentInclude

export type Comment = {
  createdAt: string
  updatedAt: string
} & Omit<
  Prisma.CommentGetPayload<Prisma.CommentDefaultArgs>,
  'createdAt' | 'updatedAt'
>

export const commentExtension = Prisma.defineExtension({
  result: {
    comment: {
      createdAt: {
        compute({ createdAt }) {
          return formatDistanceToNowStrict(createdAt)
        },
      },
      updatedAt: {
        compute({ updatedAt }) {
          return formatDistanceToNowStrict(updatedAt)
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * Image
 * -----------------------------------------------------------------------------------------------*/

export type Image = {
  createdAt: number
  updatedAt: number
} & Omit<
  Prisma.ImageGetPayload<Prisma.ImageDefaultArgs>,
  'createdAt' | 'updatedAt'
>
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
