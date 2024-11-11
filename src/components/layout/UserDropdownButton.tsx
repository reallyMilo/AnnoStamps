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

  const { image, username, usernameURL } = session.user
  const userPath = usernameURL ? `/${usernameURL}` : `/${session.userId}`

  const menuItems = [
    {
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
        className="size-9"
        src={image}
      />
      <DropdownMenu anchor="bottom end" className="z-40">
        {!username && (
          <>
            <DropdownItem href={`${userPath}/settings`}>
              <ExclamationTriangleIcon />
              <DropdownLabel>Please set username!</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
          </>
        )}
        {menuItems.map(({ href, icon: Icon, label }) => (
          <DropdownItem href={href} key={label}>
            <Icon />
            <DropdownLabel>{label}</DropdownLabel>
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
