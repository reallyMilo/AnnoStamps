'use client'
import { BellAlertIcon, EnvelopeOpenIcon } from '@heroicons/react/24/solid'

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

export const NotificationDropdownButtonSkeleton = () => {
  return (
    <DropdownButton aria-label="Open notifications" outline>
      <BellAlertIcon />
    </DropdownButton>
  )
}
export const NotificationDropdownButton = ({
  notifications,
}: {
  notifications: Notification[]
}) => {
  const alerts = notifications.length

  return (
    <Dropdown>
      <DropdownButton
        aria-label="Open notifications"
        className="rounded-full"
        outline
      >
        <BellAlertIcon />
        {alerts > 0 && (
          <span className="absolute right-0 top-0 flex size-2 items-center justify-center rounded-full bg-accent" />
        )}
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        <DropdownHeader className="flex justify-between space-x-4">
          <Heading level={2}>Notifications</Heading>
          <Button outline>
            <EnvelopeOpenIcon />
          </Button>
        </DropdownHeader>
        <DropdownDivider />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownItem href={notification.targetUrl} key={notification.id}>
              <DropdownLabel>
                {notification.body.authorOfContent} commented on your stamp or
                comment
              </DropdownLabel>
              <DropdownDescription>
                {notification.body.content}
              </DropdownDescription>
            </DropdownItem>
          ))
        ) : (
          <DropdownItem>
            <DropdownLabel>No new notifications</DropdownLabel>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
