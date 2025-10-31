import type { Metadata } from 'next'

import logo from '@/../public/cropped-anno-stamps-logo.png'
import discordWhite from '@/../public/discord-white-icon.svg'
import github from '@/../public/github-mark.svg'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Poppins } from 'next/font/google'
import Image from 'next/image'

import '@/app/globals.css'
import { AuthSection } from '@/components/layout/AuthSection'
import { MobileNavbar } from '@/components/layout/MobileNavbar'
import { NavItems } from '@/components/layout/NavItems'
import { VersionButtons } from '@/components/layout/VersionButtons'
import {
  Container,
  Link,
  NavbarDivider,
  NavbarItem,
  Navbar as NavbarRoot,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui'

export const metadata: Metadata = {
  description: 'A community site for uploading and sharing stamps for Anno',
  keywords: ['Anno', 'Anno 177', 'Anno 1800', 'Stamps', 'Anno Stamps'],
  metadataBase: new URL('https://annostamps.com'),
  openGraph: {
    description: 'A community site for uploading and sharing stamps for Anno',
    images: [
      {
        height: 600,
        url: 'https://annostamps.com/header.jpg',
        width: 1230,
      },
    ],
    locale: 'en_US',
    siteName: 'AnnoStamps',
    title: 'AnnoStamps | Stamp Sharing',
    type: 'website',
    url: 'https://annostamps.com',
  },
  title: 'AnnoStamps | Stamp Sharing',
}

const poppins = Poppins({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '700'],
})

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

const Navbar = () => {
  return (
    <header>
      <Container className="py-0">
        <div className="max-md:hidden">
          <VersionButtons />
        </div>
        <NavbarRoot className="pt-0">
          <MobileNavbar socials={<SocialIcons />}>
            <NavItems isSidebar />
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
            <NavItems />
          </NavbarSection>
          <NavbarSpacer />
          <AuthSection />
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

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={poppins.className} lang="en">
      <body>
        <div className="bg-default flex min-h-screen flex-col dark:bg-zinc-900">
          <Navbar />
          <main className="relative mx-auto min-h-full w-full grow">
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

export default SiteLayout
