'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const deleteStamp = async (stampId: string) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { error: 'Unauthorized', ok: false, status: 401 }
  }

  if (!session.user.username) {
    return { error: 'Please set username', ok: false, status: 400 }
  }

  let deletedRecord = null
  try {
    deletedRecord = await prisma.$transaction(async (tx) => {
      const userStamp = await tx.user.findUnique({
        select: {
          listedStamps: {
            where: {
              id: stampId,
            },
          },
        },
        where: {
          id: session.userId,
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
      return { error: e.message, ok: false, status: 403 }
    }
    console.error(e)
    return { error: `${stampId} - failed to delete`, ok: false, status: 500 }
  }

  const appendGameRoute =
    deletedRecord.game === '117' ? '' : `/${deletedRecord.game}`
  revalidatePath(`/${session.user.usernameURL}${appendGameRoute}`)
  revalidatePath(`/${session.userId}${appendGameRoute}`)
  return { message: `${stampId} - successfully deleted`, ok: true, status: 200 }
}
