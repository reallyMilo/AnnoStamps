import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import type { Session } from 'next-auth'
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

const UserMenu = () => {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated')
    return <Button href="/auth/signin">Add Stamp</Button>
  if (status === 'loading')
    return <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />

  const { username, usernameURL } = session?.user as NonNullable<
    Session['user']
  >

  const userPath = usernameURL ? `/${usernameURL}` : `/${session?.user.id}`

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
        src={session?.user.image}
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

export default UserMenu
