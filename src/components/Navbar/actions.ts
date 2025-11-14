'use server'

import { headers } from 'next/headers'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'
import 'server-only'

export const readAllAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return { error: 'Unauthorized', ok: false, status: 401 }
  }

  try {
    const { count } = await prisma.notification.updateMany({
      data: {
        isRead: true,
      },
      where: {
        isRead: false,
        userId: session.userId,
      },
    })

    return {
      message: `Marked ${count} notifications as read`,
      ok: true,
      status: 200,
    }
  } catch (e) {
    console.error('Error marking notifications as read:', e)
    return {
      error: 'Internal server error',
      ok: false,
      status: 500,
    }
  }
}
