'use client'
import { BellAlertIcon, EnvelopeOpenIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { Suspense, use } from 'react'

import type { Notification } from '@/lib/prisma/models'

import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  Heading,
} from '../ui'
import { readAllAction } from './actions'

const NotificationThread = ({
  notificationsPromise,
}: {
  notificationsPromise: Promise<Notification[]>
}) => {
  const notificationContent = use(notificationsPromise)

  return (
    <>
      {notificationContent.length > 0 ? (
        notificationContent.map(({ body, id, targetUrl }) => (
          <DropdownItem href={targetUrl} key={id}>
            <DropdownLabel>
              {body.authorOfContent} commented on your
            </DropdownLabel>
            <DropdownDescription>{body.content}</DropdownDescription>
          </DropdownItem>
        ))
      ) : (
        <DropdownItem>
          <DropdownLabel>No new notifications</DropdownLabel>
        </DropdownItem>
      )}
    </>
  )
}

export const NotificationDropdownButton = ({
  notificationsPromise,
}: {
  notificationsPromise: Promise<Notification[]>
}) => {
  const { data: session, update } = useSession()

  const isReadNotification = session?.user.notifications[0]?.isRead ?? false

  return (
    <Dropdown>
      <DropdownButton
        aria-label="Open notifications"
        className="rounded-full"
        outline
      >
        <BellAlertIcon />
        {!isReadNotification && (
          <span className="absolute right-0 top-0 flex size-2 items-center justify-center rounded-full bg-accent" />
        )}
      </DropdownButton>
      <DropdownMenu anchor="bottom end" className="z-40">
        <DropdownHeader className="flex justify-between space-x-4">
          <Heading level={2}>Notifications</Heading>
          {!isReadNotification && (
            <Button
              disabled={isReadNotification}
              onClick={async () => {
                const res = await readAllAction()
                if (!res.ok) {
                  return
                }
                await update()
              }}
              outline
            >
              <EnvelopeOpenIcon />
            </Button>
          )}
        </DropdownHeader>
        <DropdownDivider />
        <Suspense fallback={'Loading...'}>
          <NotificationThread notificationsPromise={notificationsPromise} />
        </Suspense>
      </DropdownMenu>
    </Dropdown>
  )
}

export const NotificationDropdownButtonSkeleton = () => {
  return (
    <DropdownButton aria-label="Open notifications" outline>
      <BellAlertIcon />
    </DropdownButton>
  )
}
