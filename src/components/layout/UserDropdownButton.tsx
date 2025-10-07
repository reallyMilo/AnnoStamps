'use client'

import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

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
import { signOut, useSession } from '@/lib/auth-client'

export const UserDropdownButton = () => {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  if (isPending) return
  if (!session) {
    return <Button href="/auth/signin">Add Stamp</Button>
  }
  const isVersionRoute = pathname.includes('1800')

  const gameVersion = isVersionRoute ? '/1800' : ''

  const { id, image, usernameURL } =
    status === 'authenticated' ? session.user : {}

  const userPath = usernameURL ? `/${usernameURL}` : `/${id}`

  const menuItems = [
    {
      href: `${userPath}/settings`,
      icon: UserIcon,
      label: 'My Account',
    },
    {
      href: `${userPath}${gameVersion}`,
      icon: HomeIcon,
      label: 'My stamps',
    },
    {
      href: `${gameVersion}/stamp/create`,
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
