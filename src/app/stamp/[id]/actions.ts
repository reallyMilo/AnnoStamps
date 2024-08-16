'use server'

import { revalidatePath } from 'next/cache'

import type { StampWithRelations } from '@/lib/prisma/models'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const likeMutation = async (id: StampWithRelations['id']) => {
  const session = await auth()
  if (!session) {
    return { ok: false }
  }

  try {
    await prisma.stamp.update({
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
      },
      include: { likedBy: true },
      where: { id },
    })
  } catch (e) {
    console.error(e)
    return { ok: false }
  }

  revalidatePath(`/stamp/${id}`)
  return { ok: true }
}
