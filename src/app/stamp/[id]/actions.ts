'use server'

import { createId } from '@paralleldrive/cuid2'
import { revalidatePath } from 'next/cache'

import type { Comment, StampWithRelations } from '@/lib/prisma/models'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const likeMutation = async (id: StampWithRelations['id']) => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized', ok: false }
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
    return { message: 'Server error.', ok: false }
  }

  revalidatePath(`/stamp/${id}`)
  return { message: 'Successfully liked stamp.', ok: true }
}

export const addCommentToStamp = async (
  id: Comment['id'] | StampWithRelations['id'],
  parentId: Comment['parentId'],
  formData: FormData,
) => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized', ok: false }
  }

  const { comment } = Object.fromEntries(formData) as {
    comment: string
  }
  try {
    await prisma.comment.create({
      data: {
        content: comment,
        id: createId(),
        parentId: parentId ? parentId : null,
        stampId: id,
        userId: session.userId,
      },
    })
  } catch (e) {
    console.error(e)
    return { message: 'Server error.', ok: false }
  }

  revalidatePath(`/stamp/${id}`)
  return { message: 'Added comment to stamp.', ok: true }
}
