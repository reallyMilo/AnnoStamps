import './globals.css'

import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { Suspense } from 'react'

import { UserButton } from '@/components/Auth/UserButton'
import { Search } from '@/components/Filter/Search'
import {
  Container,
  Link,
  Navbar as NavbarRoot,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
  SidebarItem,
} from '@/components/ui'

import logo from '../../public/cropped-anno-stamps-logo.png'
import discordWhite from '../../public/discord-white-icon.svg'
import github from '../../public/github-mark.svg'
import { MobileNavbar } from './MobileNavbar'

export const metadata: Metadata = {
  title: 'Anno 1800 Stamps | Stamp Sharing',
  description:
    'A community site for uploading and sharing stamps for Anno 1800',
  keywords: ['Anno', 'Anno 1800', 'Stamps', 'Anno Stamps'],
  openGraph: {
    title: 'Anno 1800 Stamps | Stamp Sharing',
    description:
      'A community site for uploading and sharing stamps for Anno 1800',
    url: 'https://annostamps.com',
    siteName: 'AnnoStamps',
    images: [
      {
        url: 'https://annostamps.com/header.jpg',
        width: 1230,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL('https://annostamps.com'),
}

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})
const navigation = [
  {
    href: '/stamps',
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
    <header>
      <Container className="py-0">
        <NavbarRoot>
          <MobileNavbar>
            {navigation.map((item) => (
              <SidebarItem key={item.text} href={item.href}>
                {item.text}
              </SidebarItem>
            ))}
          </MobileNavbar>
          <Link id="header-logo" href="/" className="max-lg:hidden">
            <Image
              src={logo}
              alt="Anno Stamps"
              style={{
                width: '100%',
                maxWidth: '160px',
                height: 'auto',
              }}
            />
          </Link>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-md:hidden">
            {navigation.map((item) => (
              <NavbarItem key={item.text} href={item.href}>
                {item.text}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <Suspense>
            <Search />
          </Suspense>
          <NavbarSpacer />

          <UserButton />
        </NavbarRoot>
      </Container>
    </header>
  )
}
const Footer = () => {
  return (
    <footer>
      <Container className="py-0">
        <NavbarRoot>
          <Link id="header-logo" href="/" className="max-sm:hidden">
            <Image
              src={logo}
              alt="Anno Stamps"
              style={{
                width: '100%',
                maxWidth: '160px',
                height: 'auto',
              }}
            />
          </Link>

          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.buymeacoffee.com/miloK"
            >
              Support AnnoStamps
            </NavbarItem>

            {socials.map(({ name, url, src }) => (
              <NavbarItem
                key={`${name}-footer`}
                href={url}
                rel="noopener noreferrer"
                target="_blank"
                htmlLink={true}
              >
                <Image
                  src={src}
                  alt={name}
                  className="brightness-[0.85] contrast-0 grayscale dark:brightness-[1.7] dark:contrast-100"
                  style={{
                    maxWidth: '100%',
                    height: '32px',
                    width: '32px',
                  }}
                />{' '}
              </NavbarItem>
            ))}
          </NavbarSection>
        </NavbarRoot>
      </Container>
    </footer>
  )
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <div className="flex min-h-screen flex-col bg-default dark:bg-zinc-900">
          <Navbar />
          <main className="relative mx-auto min-h-full w-full flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
      <GoogleTagManager gtmId="G-9KT01SRSVX" />
    </html>
  )
}

export default RootLayout
