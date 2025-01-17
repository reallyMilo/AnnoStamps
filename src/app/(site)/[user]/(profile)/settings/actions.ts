'use server'

import { Prisma } from '@prisma/client'

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
  message: null | string
  ok: boolean
  status: 'error' | 'idle' | 'success'
}> => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized.', ok: false, status: 'error' }
  }
  const { biography, emailNotifications, username } = Object.fromEntries(
    formData,
  ) as {
    biography: string
    emailNotifications?: 'on'
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

  const updateData: Prisma.UserUncheckedUpdateInput = session.user.username
    ? { biography }
    : {
        biography,
        username,
        usernameURL,
      }

  const isEmailNotificationEnabled = emailNotifications
    ? emailNotifications === 'on'
    : false

  try {
    await prisma.user.update({
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

  return { message: 'Updated user info.', ok: true, status: 'success' }
}
