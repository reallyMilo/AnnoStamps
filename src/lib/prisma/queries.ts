import { Prisma } from '@prisma/client'
import { getUnixTime } from 'date-fns'
import z from 'zod'

export const stampWithRelations = {
  user: true,
  likedBy: true,
} satisfies Prisma.StampInclude

export type StampWithRelations = Omit<
  Prisma.StampGetPayload<{
    include: typeof stampWithRelations
  }>,
  'createdAt' | 'updatedAt'
> & {
  createdAt: number
  updatedAt: number
}

export const stampExtensions = Prisma.defineExtension({
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
