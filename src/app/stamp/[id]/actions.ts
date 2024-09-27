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
  stampId: StampWithRelations['id'],
  parentId: Comment['parentId'],
  userIdToNotify: Comment['user']['id'],
  formData: FormData,
) => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized.', ok: false }
  }

  if (!session.user.username) {
    return { message: 'Please set username.', ok: false }
  }
  const { comment } = Object.fromEntries(formData) as {
    comment: string
  }

  try {
    await prisma.$transaction([
      prisma.comment.create({
        data: {
          content: comment,
          id: createId(),
          parentId: parentId ? parentId : null,
          stampId,
          userId: session.userId,
        },
      }),
      prisma.notification.create({
        data: {
          body: {
            authorOfContent: session.user.username,
            authorOfContentURL: session.user.usernameURL,
            content: comment,
          },
          channel: 'web',
          id: createId(),
          targetUrl: `/stamp/${stampId}`,
          userId: userIdToNotify,
        },
      }),
    ])
  } catch (e) {
    console.error(e)
    return { message: 'Server error.', ok: false }
  }

  //TODO: AWS SES here to send email.

  revalidatePath(`/stamp/${stampId}`)
  return { message: 'Added comment to stamp.', ok: true }
}
