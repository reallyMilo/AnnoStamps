import { formatDistanceToNowStrict, getUnixTime } from 'date-fns'
import z from 'zod'

import { Prisma } from '#/client'

import { CATEGORIES } from '../constants'
import { formatIntegerWithSuffix } from './utils'

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
      id: true,
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
    'comments' | 'createdAt' | 'images' | 'updatedAt'
  > {
  createdAt: string
  images: Image[]
  suffixDownloads: string
  updatedAt: string
}

const stampSchema = z.object({
  capital: z.string().optional(),
  category: z.enum(CATEGORIES),
  downloads: z.object({ increment: z.number() }).optional(),
  game: z.enum(['1800', '117']),
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
  region: z.string().optional(),
  stampFileUrl: z.string(),
  title: z.string(),
  unsafeDescription: z.string(),
  userId: z.string(),
})

const createStampSchema = stampSchema
  .omit({ downloads: true, likedBy: true })
  .transform(({ modded, region, ...schema }) => ({
    modded: modded === 'true',
    region: region ?? 'rome',
    ...schema,
  })) satisfies z.Schema<
  Prisma.StampUncheckedCreateInput,
  Omit<Prisma.StampUncheckedCreateInput, 'modded' | 'region'> & {
    modded: string
    region?: string
  }
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
  Omit<Prisma.StampUncheckedUpdateInput, 'modded'> & {
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
      changedAtReadable: {
        compute({ changedAt }) {
          return formatDistanceToNowStrict(changedAt)
        },
      },
      createdAt: {
        compute({ createdAt }) {
          return formatDistanceToNowStrict(createdAt)
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
          return formatDistanceToNowStrict(updatedAt)
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * User
 * -----------------------------------------------------------------------------------------------*/
export const userIncludeStatement = (game = '117') => {
  return {
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
      where: {
        game,
      },
    },
  } satisfies Prisma.UserInclude
}

export interface UserWithStamps
  extends Omit<
    Prisma.UserGetPayload<{
      include: ReturnType<typeof userIncludeStatement>
      omit: {
        email: true
        emailVerified: true
        name: true
      }
    }>,
    'listedStamps'
  > {
  listedStamps: (Omit<StampWithRelations, 'likedBy' | 'user'> & {
    _count: { likedBy: number }
  })[]
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

export type Comment = Omit<
  Prisma.CommentGetPayload<{ include: typeof commentIncludeStatement }>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: number
  updatedAt: number
}

export const commentExtension = Prisma.defineExtension({
  result: {
    comment: {
      createdAt: {
        compute({ createdAt }) {
          return getUnixTime(createdAt)
        },
      },
      updatedAt: {
        compute({ updatedAt }) {
          return getUnixTime(updatedAt)
        },
      },
    },
  },
})

/* -------------------------------------------------------------------------------------------------
 * Notifications
 * -----------------------------------------------------------------------------------------------*/
export type Notification = Omit<
  Prisma.NotificationGetPayload<Prisma.NotificationDefaultArgs>,
  'body' | 'createdAt' | 'updatedAt'
> & {
  body: {
    authorOfContent: string
    authorOfContentURL: string
    content: string
  }
  createdAt: string
  updatedAt: string
}

export const notificationExtension = Prisma.defineExtension({
  result: {
    notification: {
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
 * Preference
 * -----------------------------------------------------------------------------------------------*/

export type Preference = Omit<
  Prisma.PreferenceGetPayload<Prisma.PreferenceDefaultArgs>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export const preferenceExtension = Prisma.defineExtension({
  result: {
    preference: {
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
          return getUnixTime(createdAt)
        },
      },
      updatedAt: {
        compute({ updatedAt }) {
          return getUnixTime(updatedAt)
        },
      },
    },
  },
})
