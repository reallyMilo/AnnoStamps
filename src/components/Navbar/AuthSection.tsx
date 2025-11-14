import { unstable_cache } from 'next/cache'

import '@/app/globals.css'
import { Suspense } from 'react'

import type { Notification, UserWithStamps } from '@/lib/prisma/models'

import { getSession } from '@/auth'
import { NotificationDropdownButton } from '@/components/Navbar/NotificationDropdownButton'
import { UserDropdownButton } from '@/components/Navbar/UserDropdownButton'
import { Button } from '@/components/ui'
import prisma from '@/lib/prisma/singleton'

const getUserNotifications = unstable_cache(
  async (userId: UserWithStamps['id']) =>
    prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        channel: 'web',
        userId,
      },
    }),
  ['getUserNotifications'],
  {
    revalidate: 600,
  },
)

export const AuthSection = async () => {
  const session = await getSession()

  if (!session) {
    return <Button href="/auth/signin">Add Stamp</Button>
  }

  const notificationsPromise = getUserNotifications(session.user.id) as Promise<
    Notification[]
  >

  return (
    <>
      <Suspense fallback={null}>
        <NotificationDropdownButton
          notificationsPromise={notificationsPromise}
        />
      </Suspense>
      <UserDropdownButton />
    </>
  )
}
