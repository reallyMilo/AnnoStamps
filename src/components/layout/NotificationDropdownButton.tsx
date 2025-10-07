'use client'
import { BellAlertIcon, EnvelopeOpenIcon } from '@heroicons/react/24/solid'
import { Suspense, use } from 'react'

import type { Notification } from '@/lib/prisma/models'

import { useSession } from '@/lib/auth-client'

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

  if (notificationContent.length === 0) {
    return (
      <DropdownItem>
        <DropdownLabel>No new notifications</DropdownLabel>
      </DropdownItem>
    )
  }
  return (
    <>
      {notificationContent.map(({ body, id, targetUrl }) => (
        <DropdownItem href={targetUrl} key={id}>
          <DropdownLabel>
            {body.authorOfContent} commented on your
          </DropdownLabel>
          <DropdownDescription>{body.content}</DropdownDescription>
        </DropdownItem>
      ))}
    </>
  )
}

export const NotificationDropdownButton = ({
  notificationsPromise,
}: {
  notificationsPromise: Promise<Notification[]>
}) => {
  const { data: session } = useSession()

  const isReadNotification = session?.user.notifications
    ? (session.user.notifications[0]?.isRead ?? true)
    : true
  return (
    <Dropdown>
      <DropdownButton
        aria-label="Open notifications"
        className="rounded-full"
        outline
      >
        <BellAlertIcon />
        {!isReadNotification && (
          <span
            className="bg-accent absolute top-0 right-0 flex size-2 items-center justify-center rounded-full"
            data-testid="notification-dropdown-alert-indicator"
          />
        )}
      </DropdownButton>
      <DropdownMenu anchor="bottom end" className="z-40">
        <DropdownHeader className="flex justify-between space-x-4">
          <Heading level={2}>Notifications</Heading>
          {!isReadNotification && (
            <Button
              data-testid="read-all-notifications-button"
              disabled={isReadNotification}
              onClick={async () => {
                const res = await readAllAction()
                if (!res.ok) {
                  return
                }
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
