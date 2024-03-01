'use client'

import { Menu, Transition } from '@headlessui/react'
import { HomeIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Fragment } from 'react'

const menuItems = [
  {
    label: 'My Account',
    icon: UserIcon,
    href: '/user/account',
  },
  {
    label: 'My stamps',
    icon: HomeIcon,
    href: '/user/stamps',
  },
  {
    label: 'Add new stamp',
    icon: PlusIcon,
    href: '/user/create',
  },
]
type UserMenuProps = {
  avatar: React.ReactNode
  logout: React.ReactNode
  username: React.ReactNode
}
const UserMenu = ({ avatar, username, logout }: UserMenuProps) => {
  return (
    <Menu as="div" data-testid="user-menu" className="relative z-50">
      <Menu.Button className="group flex items-center space-x-px">
        {avatar}
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
          <div className="mb-2 flex items-center space-x-2 px-4 py-4">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {avatar}
            </div>
            <div className="flex flex-col truncate">{username}</div>
          </div>

          <div className="py-2">
            {menuItems.map(({ label, href, icon: Icon }) => (
              <div
                key={label}
                className="px-2 last:mt-2 last:border-t last:pt-2"
                data-testid="user-menu-item"
              >
                <Menu.Item>
                  <Link
                    href={href}
                    className="flex items-center space-x-2 rounded-md px-4 py-2 hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-gray-500" />
                    <span>{label}</span>
                  </Link>
                </Menu.Item>
              </div>
            ))}
            <div
              className="px-2 last:mt-2 last:border-t last:pt-2"
              data-testid="user-menu-item"
            >
              <Menu.Item>{logout}</Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenu
