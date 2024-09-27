import type { Metadata } from 'next'

import { GoogleAnalytics } from '@next/third-parties/google'
import { SessionProvider } from 'next-auth/react'
import { unstable_cache } from 'next/cache'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { Suspense } from 'react'

import type { Notification, UserWithStamps } from '@/lib/prisma/models'

import { auth } from '@/auth'
import { UserMenu } from '@/components/Auth/UserMenu'
import { NotificationDropdownButton } from '@/components/Notifications/NotificationDropdownButton'
import {
  Button,
  Container,
  Link,
  NavbarDivider,
  NavbarItem,
  Navbar as NavbarRoot,
  NavbarSection,
  NavbarSpacer,
  SidebarItem,
} from '@/components/ui'
import prisma from '@/lib/prisma/singleton'

import logo from '../../public/cropped-anno-stamps-logo.png'
import discordWhite from '../../public/discord-white-icon.svg'
import github from '../../public/github-mark.svg'
import './globals.css'
import { MobileNavbar } from './MobileNavbar'

export const metadata: Metadata = {
  description:
    'A community site for uploading and sharing stamps for Anno 1800',
  keywords: ['Anno', 'Anno 1800', 'Stamps', 'Anno Stamps'],
  metadataBase: new URL('https://annostamps.com'),
  openGraph: {
    description:
      'A community site for uploading and sharing stamps for Anno 1800',
    images: [
      {
        height: 600,
        url: 'https://annostamps.com/header.jpg',
        width: 1230,
      },
    ],
    locale: 'en_US',
    siteName: 'AnnoStamps',
    title: 'Anno 1800 Stamps | Stamp Sharing',
    type: 'website',
    url: 'https://annostamps.com',
  },
  title: 'Anno 1800 Stamps | Stamp Sharing',
}

const poppins = Poppins({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '700'],
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
    src: discordWhite,
    url: 'https://discord.gg/73hfP54qXe',
  },
  {
    name: 'github',
    src: github,
    url: 'https://github.com/reallyMilo/AnnoStamps',
  },
]

const UserButton = async () => {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <UserMenu />
    </SessionProvider>
  )
}
const SocialIcons = () => {
  return (
    <>
      {socials.map(({ name, src, url }) => (
        <NavbarItem
          href={url}
          htmlLink={true}
          key={`social-icon-${name}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt={name}
            className="brightness-[0.85] contrast-0 grayscale dark:brightness-[1.7] dark:contrast-100"
            src={src}
            style={{
              height: '32px',
              maxWidth: '100%',
              width: '32px',
            }}
          />{' '}
        </NavbarItem>
      ))}
    </>
  )
}

const getUserNotifications = unstable_cache(
  async (userId: UserWithStamps['id']) =>
    prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        channel: 'web',
        userId,
      },
    }),
  ['getUserNotifications'],
  {
    revalidate: 600,
  },
)

const Notifications = async () => {
  const session = await auth()
  if (!session) {
    return null
  }
  /* TODO: get the unread notification count on the auth db round trip.
  with react use function to accept notification promise so we only trigger this if the dropdown is opened
  */
  const notifications = (await getUserNotifications(
    session?.userId,
  )) as Notification[]
  return <NotificationDropdownButton notifications={notifications} />
}

const Navbar = () => {
  return (
    <header>
      <Container className="py-0">
        <NavbarRoot>
          <MobileNavbar socials={<SocialIcons />}>
            {navigation.map((item) => (
              <SidebarItem href={item.href} key={item.text}>
                {item.text}
              </SidebarItem>
            ))}
          </MobileNavbar>
          <NavbarSpacer className="md:hidden" />
          <Link href="/" id="header-logo">
            <Image
              alt="Anno Stamps"
              src={logo}
              style={{
                height: 'auto',
                maxWidth: '160px',
                width: '100%',
              }}
            />
          </Link>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-md:hidden">
            {navigation.map((item) => (
              <NavbarItem href={item.href} key={item.text}>
                {item.text}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <Suspense fallback={null}>
            <Notifications />
          </Suspense>
          <Suspense fallback={<Button href="/auth/signin">Add Stamp</Button>}>
            <UserButton />
          </Suspense>
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
          <Link className="max-sm:hidden" href="/" id="header-logo">
            <Image
              alt="Anno Stamps"
              src={logo}
              style={{
                height: 'auto',
                maxWidth: '160px',
                width: '100%',
              }}
            />
          </Link>

          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem
              href="https://www.buymeacoffee.com/miloK"
              rel="noopener noreferrer"
              target="_blank"
            >
              Support AnnoStamps
            </NavbarItem>

            <SocialIcons />
          </NavbarSection>
        </NavbarRoot>
      </Container>
    </footer>
  )
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={poppins.className} lang="en">
      <body>
        <div className="flex min-h-screen flex-col bg-default dark:bg-zinc-900">
          <Navbar />
          <main className="relative mx-auto min-h-full w-full flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string}
      />
    </html>
  )
}

export default RootLayout
