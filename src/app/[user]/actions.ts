'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const deleteStamp = async (stampId: string) => {
  const session = await auth()

  if (!session?.user?.id) {
    return { message: 'Unauthorized.', ok: false }
  }
  if (!session.user.usernameURL) {
    return { message: 'UsernameURL not set', ok: false }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const userStamp = await tx.user.findUnique({
        select: {
          listedStamps: {
            where: {
              id: stampId,
            },
          },
        },
        where: {
          id: session.user.id,
        },
      })

      if (userStamp?.listedStamps.length === 0) {
        throw new Error('Not stamp owner')
      }

      await tx.image.deleteMany({
        where: {
          stampId,
        },
      })

      return await tx.stamp.delete({
        where: {
          id: stampId,
        },
      })
    })
  } catch (e) {
    if (e instanceof Error) {
      return { message: e.message, ok: false }
    }
    console.error(e)
    return { message: `${stampId} - failed to delete`, ok: false }
  }

  revalidatePath(`/${session.user.usernameURL}`)
  return { message: `${stampId} - successfully deleted`, ok: true }
}
