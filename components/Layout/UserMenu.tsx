import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { displayAuthModal } from 'lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
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
  // {
  //   label: "Favorites",
  //   icon: HeartIcon,
  //   href: "/favorites",
  // },
  {
    label: 'Logout',
    icon: ArrowLeftIcon,
    href: null,
  },
]

const UserMenu = () => {
  const { data: session, status } = useSession()
  const user = session?.user

  const handleOnClick = () => {
    displayAuthModal()
  }

  if (status === 'loading')
    return <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />

  if (!user)
    return (
      <button
        type="button"
        onClick={handleOnClick}
        className="ml-4 rounded-md bg-[#6DD3C0] px-4 py-2 text-sm font-bold text-[#222939] transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
        data-testid="login-button"
      >
        Add Stamp
      </button>
    )
  return (
    <Menu as="div" data-testid="user-menu" className="relative z-50">
      <Menu.Button className="group flex items-center space-x-px">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {user?.image ? (
            <Image src={user.image} alt="Avatar" fill sizes="100vw" />
          ) : (
            <UserIcon className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <ChevronDownIcon className="h-5 w-5 shrink-0 text-white group-hover:text-white" />
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
              {user?.image ? (
                <Image src={user.image} alt="Avatar" fill sizes="100vw" />
              ) : (
                <UserIcon className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col truncate">
              <span id="user-name">{user?.name}</span>
              <span id="user-email" className="text-sm text-gray-500">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map(({ label, href, icon: Icon }) => (
              <div
                key={label}
                className="px-2 last:mt-2 last:border-t last:pt-2"
                data-testid="user-menu-item"
              >
                <Menu.Item>
                  {href ? (
                    <Link
                      href={href}
                      className="flex items-center space-x-2 rounded-md px-4 py-2 hover:bg-gray-100"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-gray-500" />
                      <span>{label}</span>
                    </Link>
                  ) : (
                    <button
                      data-testid="logout-button"
                      className="flex w-full items-center space-x-2 rounded-md px-4 py-2 hover:bg-gray-100"
                      onClick={() => signOut()}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-gray-500" />
                      <span>{label}</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenu
