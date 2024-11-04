'use client'

import Image from 'next/image'
import { useState } from 'react'

import {
  Link,
  MobileSidebar,
  NavbarItem,
  OpenMenuIcon,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarSection,
} from '@/components/ui'

import logo from '../../../public/anno-stamps-logo.png'

export const MobileNavbar = ({
  children,
  socials,
}: React.PropsWithChildren<{ socials: React.ReactNode }>) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <NavbarItem
        aria-label="Open navigation"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <OpenMenuIcon />
      </NavbarItem>
      <MobileSidebar close={() => setIsOpen(false)} open={isOpen}>
        <Sidebar>
          <SidebarHeader>
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
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>{children}</SidebarSection>
          </SidebarBody>
          <SidebarFooter className="flex-row">{socials}</SidebarFooter>
        </Sidebar>
      </MobileSidebar>
    </>
  )
}
