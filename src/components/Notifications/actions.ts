'use server'

import 'server-only'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const readAllAction = async () => {
  const session = await auth()
  if (!session) {
    return { message: 'Unauthorized.', ok: false }
  }

  try {
    await prisma.notification.updateMany({
      data: {
        isRead: true,
      },
      where: {
        isRead: false,
        userId: session.userId,
      },
    })
  } catch (e) {
    console.error(e)
    return { message: 'Server error in reading all mail.', ok: false }
  }

  return { message: 'Read all notifications.', ok: true }
}
