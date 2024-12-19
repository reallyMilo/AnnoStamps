'use client'

import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'

import {
  AvatarButton,
  Button,
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui'

export const UserDropdownButton = () => {
  const { data: session } = useSession()

  if (!session) {
    return <Button href="/auth/signin">Add Stamp</Button>
  }

  const { id, image, usernameURL } = session.user
  const isUsernameSet = Boolean(usernameURL)
  const userPath = isUsernameSet ? `/${usernameURL}` : `/${id}`

  const menuItems = [
    {
      alert: isUsernameSet,
      href: `${userPath}/settings`,
      icon: UserIcon,
      label: 'My Account',
    },
    {
      href: userPath,
      icon: HomeIcon,
      label: 'My stamps',
    },
    {
      href: '/stamp/create',
      icon: PlusIcon,
      label: 'Add new stamp',
    },
  ]
  return (
    <Dropdown>
      <DropdownButton
        aria-label="Account options"
        as={AvatarButton}
        src={image}
      />

      <DropdownMenu anchor="bottom end" className="z-40">
        {menuItems.map(({ alert, href, icon: Icon, label }) => (
          <DropdownItem href={href} key={label}>
            <Icon />
            <DropdownLabel>{label}</DropdownLabel>
            <div className="flex justify-end">
              {alert === false && (
                <ExclamationTriangleIcon
                  className="size-4"
                  data-testid="triangle-icon"
                />
              )}
            </div>
          </DropdownItem>
        ))}
        <DropdownDivider />
        <DropdownItem onClick={() => signOut()}>
          <ArrowLeftIcon />
          <DropdownLabel>Logout</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
