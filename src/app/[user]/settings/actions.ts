'use server'

import { Prisma } from '@prisma/client'
import z from 'zod'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const updateUserSettings = async (
  prevState: { message: string | null; status: string },
  formData: FormData
): Promise<{
  message: string | null
  status: 'idle' | 'error' | 'success'
}> => {
  const session = await auth()
  if (!session) {
    throw new Error('Not authenticated.')
  }

  try {
    const userSettingsScehma = z.object({
      username: z.string(),
      biography: z.string(),
    })
    const formDataEntries = Object.fromEntries(formData)
    const { username, biography } = userSettingsScehma.parse(formDataEntries)

    const updateData = session.user.username
      ? { biography }
      : {
          username,
          usernameURL: username.toLowerCase(),
          biography,
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
    return { message: 'Server error, contact discord.', status: 'error' }
  }
}
