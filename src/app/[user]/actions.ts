'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const deleteStamp = async (stampId: string) => {
  const session = await auth()

  if (!session?.user?.id) {
    return { ok: false, message: 'Unauthorized.' }
  }
  if (!session.user.usernameURL) {
    return { ok: false, message: 'UsernameURL not set' }
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
      return { ok: false, message: e.message }
    }
    console.error(e)
    return { ok: false, message: `${stampId} - failed to delete` }
  }

  revalidatePath(`/${session.user.usernameURL}`)
  return { ok: true, message: `${stampId} - successfully deleted` }
}
