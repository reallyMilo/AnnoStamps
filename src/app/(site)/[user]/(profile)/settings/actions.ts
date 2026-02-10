'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import type { UserWithStamps } from '@/lib/prisma/models'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'
import { Prisma } from '#/client'

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
  state: 'error' | 'success'
}> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { error: 'Unauthorized', ok: false, state: 'error' }
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
      state: 'error',
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

  let updateResponse = null
  try {
    updateResponse = await prisma.user.update({
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          error: 'Username already taken',
          ok: false,
          state: 'error',
        }
      }
    }
    console.error(e)
    return {
      error: 'Server error, contact discord',
      ok: false,
      state: 'error',
    }
  }

  revalidatePath(`${session.userId}/settings`)
  revalidatePath(`${session.user.usernameURL}/settings`)
  return {
    data: updateResponse,
    message: 'Updated user info',
    ok: true,
    state: 'success',
  }
}
