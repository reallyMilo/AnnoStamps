'use server'

import { Prisma } from '@prisma/client'

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

type BaseResponse = {
  message: null | string
  status: 'error' | 'idle' | 'success'
}

type SuccessResponse = {
  data: Omit<UserWithStamps, 'likedStamps' | 'listedStamps'>
  ok: true
} & BaseResponse

type ErrorResponse = {
  data?: undefined
  ok: false
} & BaseResponse

type Response = Promise<ErrorResponse | SuccessResponse>

export const updateUserSettings = async (
  formData: FormData,
): Promise<Response> => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized.', ok: false, status: 'error' }
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
      message: 'Not allowed to use as username.',
      ok: false,
      status: 'error',
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
      message: 'Updated user info.',
      ok: true,
      status: 'success',
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          message: 'Username already taken.',
          ok: false,
          status: 'error',
        }
      }
    }
    console.error(e)
    return {
      message: 'Server error, contact discord.',
      ok: false,
      status: 'error',
    }
  }
}
