'use server'

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
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
          connect: { id: session.userId },
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
  const targetUrl = `/stamp/${stampId}`
  let userPreference = null
  try {
    const [, , preference] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content: comment,
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
          targetUrl,
          userId: userIdToNotify,
        },
      }),
      prisma.preference.findFirst({
        where: {
          channel: 'email',
          userId: userIdToNotify,
        },
      }),
    ])

    userPreference = preference
  } catch (e) {
    console.error(e)
    return { message: 'Prisma error.', ok: false }
  }

  if (process.env.AWS_S3_BUCKET === 'eu-central-1') {
    if (!userPreference || userPreference.enabled === true) {
      try {
        const client = new LambdaClient({ region: 'eu-central-1' })
        const command = new InvokeCommand({
          FunctionName: 'sendEmailSES',
          InvocationType: 'Event',
          Payload: JSON.stringify({
            body: {
              authorOfContent: session.user.username,
              authorOfContentURL: session.user.usernameURL,
              content: comment,
            },
            stampId,
            targetUrl,
            userIdToNotify,
          }),
        })
        const response = await client.send(command)
        if (response.StatusCode !== 202) {
          console.error(response)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  revalidatePath(`/stamp/${stampId}`)
  return { message: 'Added comment to stamp.', ok: true }
}
