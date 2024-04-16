import { Menu, Transition } from '@headlessui/react'
import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { Fragment } from 'react'

import { cn } from '@/lib/utils'

const Avatar = ({ src }: { src: string | undefined | null }) => {
  if (!src) {
    return <UserIcon className="h-6 w-6 text-gray-400" />
  }

  return <Image src={src} alt="Avatar" height={36} width={36} />
}
const UserMenu = () => {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated')
    return (
      <Link
        href="/auth/signin"
        className="ml-4 rounded-md bg-primary px-4 py-2 text-sm font-bold text-dark transition hover:bg-accent hover:text-default focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
      >
        Add Stamp
      </Link>
    )
  if (status === 'loading')
    return <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />

  const { image, username, usernameURL } = session?.user as NonNullable<
    Session['user']
  >

  const usernamePath = usernameURL ? `/${usernameURL}` : '/user/account'

  const menuItems = [
    {
      label: 'My Account',
      icon: UserIcon,
      href: '/user/account',
    },
    {
      label: 'My stamps',
      icon: HomeIcon,
      href: usernamePath,
    },
    {
      label: 'Add new stamp',
      icon: PlusIcon,
      href: '/user/create',
    },
  ]

  return (
    <Menu as="div" data-testid="user-menu" className="relative z-50">
      <Menu.Button className="group flex items-center space-x-px">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          <Avatar src={image} />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items
          data-testid="user-dropdown"
          className="absolute right-0 mt-1 w-72 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="flex items-center space-x-2 px-4 py-4">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              <Avatar src={image} />
            </div>

            <Link
              href={usernamePath}
              className={cn(username ? '' : 'text-blue-500 underline')}
              role="link"
            >
              {username ? username : 'Please set username!'}
            </Link>
          </div>

          <div className="py-2">
            {menuItems.map(({ label, href, icon: Icon }) => (
              <Menu.Item key={label} as="div" data-testid="user-menu-item">
                <Link
                  href={href}
                  className="flex items-center space-x-4 rounded-md px-6 py-2 hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5 shrink-0 text-gray-500" />
                  <span>{label}</span>
                </Link>
              </Menu.Item>
            ))}

            <button
              data-testid="logout-button"
              className="mt-2 flex w-full items-center space-x-4 rounded-md border-t px-6 py-2 pt-2 hover:bg-gray-100"
              onClick={() => signOut({ callbackUrl: '/' })}
              role="button"
            >
              <ArrowLeftIcon className="h-5 w-5 shrink-0 text-gray-500" />
              <span>Logout</span>
            </button>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenu
