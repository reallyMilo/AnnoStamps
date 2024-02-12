import './globals.css'

import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import UserMenu from '@/components/Auth/UserMenu'
import Search from '@/components/Filter/Search'

export const metadata: Metadata = {
  title: 'Anno 1800 Stamps | Stamp Sharing',
  description:
    'A community site for uploading and sharing stamps for Anno 1800',
  openGraph: {
    title: 'Anno 1800 Stamps | Stamp Sharing',
    description:
      'A community site for uploading and sharing stamps for Anno 1800',
  },
  metadataBase: new URL(`${process.env.NEXTAUTH_URL}`),
}

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

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
const socials = [
  {
    name: 'discord',
    url: 'https://discord.gg/73hfP54qXe',
    src: '/discord-white-icon.svg',
  },
  {
    name: 'github',
    url: 'https://github.com/reallyMilo/AnnoStamps',
    src: '/github-mark.svg',
  },
]

const Navbar = () => {
  return (
    <header className="relative z-20 h-20 w-full bg-[#222939] shadow-md">
      <div className="container mx-auto h-full">
        <div className="flex h-full items-center justify-between space-x-4 px-1 md:px-4">
          <div className="flex md:space-x-6">
            <Link
              id="header-logo"
              href="/"
              className="hidden items-center space-x-1 md:flex"
            >
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
          {/* <UserMenu /> */}
        </div>
      </div>
    </header>
  )
}
const Footer = () => {
  return (
    <footer className="mt-auto bg-[#222939] py-6">
      <div className="container mx-auto flex items-center justify-between px-5">
        <p className="text-sm font-bold text-white">Anno Stamps</p>

        <div className="flex items-center space-x-5 px-5">
          <a
            href="https://www.buymeacoffee.com/miloK"
            target="_blank"
            className="text-white"
          >
            Support AnnoStamps
          </a>
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              data-testid={social.name}
            >
              <Image
                src={social.src}
                alt={social.name}
                width={32}
                height={32}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />{' '}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-[#F0F3F4] bg-opacity-95">
        <div className="flex h-full min-h-screen w-full flex-col">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
      <GoogleTagManager gtmId="G-9KT01SRSVX" />
    </html>
  )
}

export default RootLayout
