'use server'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const deleteStamp = async (id: string) => {
  const session = await auth()
  if (!session) {
    throw new Error('Not authenticated')
  }

  await prisma.user.findUniqueOrThrow({
    select: {
      listedStamps: {
        where: {
          id,
        },
      },
    },
    where: {
      id: session.user.id,
    },
  })

  const deleteImages = prisma.image.deleteMany({
    where: {
      stampId: id,
    },
  })

  const deleteStamp = prisma.stamp.delete({
    where: {
      id,
    },
  })

  await prisma.$transaction([deleteImages, deleteStamp])

  revalidatePath('/user/stamps')
}

export const updateUser = async (
  prevState: {
    biography?: string | null
    message: string
    ok: boolean
    username?: string | null
  },
  formData: FormData
) => {
  const session = await auth()
  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    const { username, biography } = Object.fromEntries(formData) as Record<
      keyof Pick<typeof prevState, 'username' | 'biography'>,
      string
    >

    const updateData = session.user.username
      ? { biography }
      : {
          username,
          usernameURL: username.toLowerCase(),
          biography,
        }

    const update = await prisma.user.update({
      data: updateData,
      where: { id: session.user.id },
    })

    return {
      username: update.username,
      biography: update.biography,
      ok: true,
      message: 'update username',
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return { ...prevState, ok: false, message: 'username already taken.' }
      }
    }
    return { ...prevState, ok: false, message: 'prisma error' }
  }
}
