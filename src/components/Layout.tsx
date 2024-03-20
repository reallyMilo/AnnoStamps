import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import UserButton from '@/components/Auth/UserButton'
import Search from '@/components/Filter/Search'

import headerLogo from '../../public/anno-stamps-logo.svg'
import discordWhite from '../../public/discord-white-icon.svg'
import github from '../../public/github-mark.svg'
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
    src: discordWhite,
  },
  {
    name: 'github',
    url: 'https://github.com/reallyMilo/AnnoStamps',
    src: github,
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
                src={headerLogo}
                alt="Anno Stamps"
                style={{
                  width: '100%',
                  maxWidth: '160px',
                  height: 'auto',
                }}
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
          <UserButton />
        </div>
      </div>
    </header>
  )
}
const Footer = () => {
  return (
    <footer className="mt-auto  bg-[#222939] py-6">
      <div className="container mx-auto flex items-center justify-between px-5">
        <p className="text-sm font-bold text-white">Anno Stamps</p>

        <div className="flex items-center space-x-5">
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
                style={{
                  maxWidth: '100%',
                  height: '32px',
                  width: '32px',
                }}
              />{' '}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Anno 1800 Stamps | Stamp Sharing</title>
        <meta
          name="description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        ></meta>
        <meta name="og:title" content="Anno 1800 Stamps | Stamp Sharing" />
        <meta
          name="og:description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="flex min-h-screen flex-col bg-[#F0F3F4]">
        <Navbar />

        <main className="s relative z-10 mx-auto mb-20 min-h-full w-full bg-[#F0F3F4] bg-opacity-95">
          {children}
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Layout
