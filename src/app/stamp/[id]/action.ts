'use server'

import { auth } from '@/auth'
import type { StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

export const likeStamp = async (id: StampWithRelations['id']) => {
  const session = await auth()
  if (!session) {
    return { ok: false, likes: null }
  }

  try {
    const updateStampLikes = await prisma.stamp.update({
      where: { id },
      include: { likedBy: true },
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
      },
    })

    return { ok: true, likes: updateStampLikes.likedBy.length }
  } catch (e) {
    console.error(e)
    return { ok: false, likes: null }
  }
}
