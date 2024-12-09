'use client'

import { useState } from 'react'

import {
  MobileSidebar,
  NavbarItem,
  OpenMenuIcon,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarSection,
} from '@/components/ui'

import { VersionButtons } from './VersionButtons'

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
            <VersionButtons />
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
