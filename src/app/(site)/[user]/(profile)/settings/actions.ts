'use server'

import { Prisma } from '@prisma/client'
import { headers } from 'next/headers'

import type { UserWithStamps } from '@/lib/prisma/models'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

const blockedUsernames = new Set<string>([
  '117',
  '1800',
  'privacy',
  'stamp',
  'stamps',
])

export const updateUserSettings = async (
  formData: FormData,
): Promise<{
  data?: Omit<UserWithStamps, 'likedStamps' | 'listedStamps'>
  error?: string
  message?: string
  ok: boolean
  status: number
}> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { error: 'Unauthorized', ok: false, status: 401 }
  }

  const {
    biography,
    emailNotifications,
    image: avatar,
    username,
  } = Object.fromEntries(formData) as {
    biography: string
    emailNotifications?: 'on'
    image: string | undefined
    username: string
  }

  const usernameURL = username.toLowerCase()

  if (blockedUsernames.has(usernameURL)) {
    return {
      error: 'Not allowed to use as username',
      ok: false,
      status: 403,
    }
  }

  const image = avatar === 'remove' ? null : avatar
  const updateData: Prisma.UserUncheckedUpdateInput = session.user.username
    ? { biography, image }
    : {
        biography,
        image,
        username,
        usernameURL,
      }

  const isEmailNotificationEnabled = emailNotifications
    ? emailNotifications === 'on'
    : false

  try {
    const res = await prisma.user.update({
      data: {
        ...updateData,
        preferences: {
          upsert: {
            create: {
              channel: 'email',
              enabled: isEmailNotificationEnabled,
            },
            update: {
              channel: 'email',
              enabled: isEmailNotificationEnabled,
            },
            where: {
              userId_channel: {
                channel: 'email',
                userId: session.userId,
              },
            },
          },
        },
      },
      where: { id: session.userId },
    })
    return {
      data: res,
      message: 'Updated user info',
      ok: true,
      status: 200,
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          error: 'Username already taken',
          ok: false,
          status: 409,
        }
      }
    }
    console.error(e)
    return {
      error: 'Server error, contact discord',
      ok: false,
      status: 500,
    }
  }
}
