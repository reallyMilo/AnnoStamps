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

export const UserMenu = () => {
  const { data: session } = useSession()

  if (!session) {
    return <Button href="/auth/signin">Add Stamp</Button>
  }

  const { id, username, usernameURL, image } = session.user
  const userPath = usernameURL ? `/${usernameURL}` : `/${id}`

  const menuItems = [
    {
      label: 'My Account',
      icon: UserIcon,
      href: `${userPath}/settings`,
    },
    {
      label: 'My stamps',
      icon: HomeIcon,
      href: userPath,
    },
    {
      label: 'Add new stamp',
      icon: PlusIcon,
      href: '/stamp/create',
    },
  ]
  return (
    <Dropdown>
      <DropdownButton
        className="size-9"
        as={AvatarButton}
        src={image}
        aria-label="Account options"
      />
      <DropdownMenu className="z-40" anchor="bottom end">
        {!username && (
          <>
            <DropdownItem href={`${userPath}/settings`}>
              <ExclamationTriangleIcon />
              <DropdownLabel>Please set username!</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
          </>
        )}
        {menuItems.map(({ label, icon: Icon, href }) => (
          <DropdownItem key={label} href={href}>
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
