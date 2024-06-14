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
  SidebarHeader,
  SidebarSection,
} from '@/components/ui'

import logo from '../../public/cropped-anno-stamps-logo.png'

export const MobileNavbar = ({ children }: React.PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <NavbarItem
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        className="md:hidden"
      >
        <OpenMenuIcon />
      </NavbarItem>
      <MobileSidebar open={isOpen} close={() => setIsOpen(false)}>
        <Sidebar>
          <SidebarHeader>
            <Link id="header-logo" href="/">
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
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>{children}</SidebarSection>
          </SidebarBody>
        </Sidebar>
      </MobileSidebar>
    </>
  )
}
