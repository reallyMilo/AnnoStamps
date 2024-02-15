import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

import { auth, signOut } from '@/auth'

import UserMenu from './UserMenu'

const UserButton = async () => {
  const session = await auth()

  if (!session?.user)
    return (
      <Link
        href="/auth/signin"
        className="ml-4 rounded-md bg-[#6DD3C0] px-4 py-2 text-sm font-bold text-[#222939] transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
      >
        Add Stamp
      </Link>
    )
  const { user } = session
  //FIXME: dropdowns should be composition pattern of client components to pass server components as children
  return (
    <UserMenu
      avatar={
        user?.image ? (
          <Image src={user.image} alt="Avatar" fill sizes="100vw" />
        ) : (
          <UserIcon className="h-6 w-6 text-gray-400" />
        )
      }
      username={
        user?.username ? (
          <span id="user-name">{user?.username}</span>
        ) : (
          <Link href={'/user/account'} className="text-blue-500 underline">
            Set username!
          </Link>
        )
      }
      logout={
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button
            data-testid="logout-button"
            className="flex w-full items-center space-x-2 rounded-md px-4 py-2 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 shrink-0 text-gray-500" />
            <span>Logout</span>
          </button>
        </form>
      }
    />
  )
}

export default UserButton
