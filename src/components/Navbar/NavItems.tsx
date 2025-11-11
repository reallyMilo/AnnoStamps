'use client'
import { usePathname } from 'next/navigation'

import { NavbarItem, SidebarItem } from '@/components/ui'

export const NavItems = ({ isSidebar = false }) => {
  const pathname = usePathname()
  const isVersionRoute = pathname.includes('1800')

  const append = isVersionRoute ? '/1800' : ''

  const navigation = [
    {
      href: `${append}/stamps`,
      text: 'All Stamps',
    },
    {
      href: `${append}/how-to`,
      text: 'How To',
    },
  ]

  if (isSidebar) {
    return navigation.map((item) => (
      <SidebarItem href={item.href} key={item.text}>
        {item.text}
      </SidebarItem>
    ))
  }

  return navigation.map((item) => (
    <NavbarItem href={item.href} key={item.text}>
      {item.text}
    </NavbarItem>
  ))
}
