import Image from 'next/image'
import Link from 'next/link'

import Search from '../Filter/Search'
import UserMenu from './UserMenu'
const navigation = [
  {
    href: '/',
    text: 'All Stamps',
  },
  {
    href: '/how-to',
    text: 'How To',
  },
]
const Navbar = () => {
  return (
    <header className="relative z-20 h-20 w-full bg-[#222939] shadow-md">
      <div className="container mx-auto h-full">
        <div className="flex h-full items-center justify-between space-x-4 px-4">
          <div className="flex space-x-6">
            <Link href="/" className="hidden items-center space-x-1 md:flex">
              <Image
                src="/anno-stamps-logo.svg"
                width="160"
                height="60"
                alt="Anno Stamps"
                priority
                style={{
                  width: '100%',
                  maxWidth: '160px',
                  height: 'auto',
                }}
                className="w-[100px] md:w-[160px]"
              />
            </Link>
            <nav className="flex items-center space-x-4 text-center text-xs font-bold md:text-left md:text-sm">
              {navigation.map((item) => (
                <Link
                  key={item.text}
                  href={item.href}
                  className="block rounded-md px-3 py-1 text-white transition hover:bg-amber-800"
                >
                  {item.text}
                </Link>
              ))}
            </nav>
            <Search />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export default Navbar
