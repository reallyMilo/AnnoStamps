'use server'

import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const updateUserSettings = async (
  formData: FormData,
): Promise<{
  message: null | string
  status: 'error' | 'idle' | 'success'
}> => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized.', status: 'error' }
  }
  try {
    const { biography, username } = Object.fromEntries(formData) as {
      biography: string
      username: string
    }

    const updateData = session.user.username
      ? { biography }
      : {
          biography,
          username,
          usernameURL: username.toLowerCase(),
        }

    await prisma.user.update({
      data: updateData,
      where: { id: session.user.id },
    })

    return { message: 'Updated user info.', status: 'success' }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return { message: 'Username already taken.', status: 'error' }
      }
    }
    console.error(e)
    return { message: 'Server error, contact discord.', status: 'error' }
  }
}
