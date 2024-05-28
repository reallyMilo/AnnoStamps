import Head from 'next/head'
import Image from 'next/image'

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
} from '@/components/ui'

import headerLogo from '../../public/anno-stamps-logo.svg'
import discordWhite from '../../public/discord-white-icon.svg'
import github from '../../public/github-mark.svg'

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
          <Link id="header-logo" href="/">
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
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navigation.map((item) => (
              <NavbarItem key={item.text} href={item.href}>
                {item.text}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <Search />
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
          <Link id="header-logo" href="/" className="max-lg:hidden">
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

export const Layout = ({ children }: { children: React.ReactNode }) => {
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

      <div className="flex min-h-screen flex-col bg-default dark:bg-zinc-900">
        <Navbar />

        <main className="relative mx-auto min-h-full w-full flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </>
  )
}
