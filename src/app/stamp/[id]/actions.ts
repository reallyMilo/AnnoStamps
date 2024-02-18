'use server'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import type { StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

export const likeStamp = async (id: StampWithRelations['id']) => {
  const session = await auth()
  if (!session) {
    return { authenticated: false, likes: 0 }
  }

  const updateStampLikes = await prisma.stamp.update({
    where: { id },
    include: { likedBy: true },
    data: {
      likedBy: {
        connect: { id: session.user.id },
      },
    },
  })

  revalidatePath(`/stamp/${id}`)
  return { authenticated: true, likes: updateStampLikes.likedBy.length }
}
