'use server'
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
