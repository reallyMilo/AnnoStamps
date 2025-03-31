'use client'

import anno117 from '@/../public/anno117-icon.jpg'
import anno1800 from '@/../public/anno1800-icon.webp'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import { Button } from '@/components/ui'

const versions = new Set(['1800'])
const duplicatePaths = new Set(['how-to', 'stamp', 'stamps'])

export const VersionButtons = () => {
  const pathname = usePathname()

  const buildEquivalentPath = useMemo(() => {
    if (pathname === '/') {
      return {
        117: pathname,
        1800: `/1800/`,
      }
    }
    const splitPathname = pathname.split('/')
    const isDuplicateRoute = duplicatePaths.has(splitPathname[1])

    if (isDuplicateRoute) {
      return {
        117: pathname,
        1800: `/1800${pathname}`,
      }
    }

    const isVersionRoute = versions.has(splitPathname[1])
    if (isVersionRoute) {
      const path = splitPathname.toSpliced(0, 2)
      return {
        117: `/${path.join('/')}`,
        1800: pathname,
      }
    }

    return {
      117: `/${splitPathname[1]}`,
      1800: `/${splitPathname[1]}/1800`,
    }
  }, [pathname])

  return (
    <div className="py-1">
      <Button
        data-testid="default-version-link"
        href={buildEquivalentPath[117]}
        plain
      >
        <Image alt="anno 117 logo icon" height={20} src={anno117} width={20} />
        117
      </Button>
      <Button
        data-testid="1800-version-link"
        href={buildEquivalentPath[1800]}
        plain
      >
        <Image
          alt="anno 1800 logo icon"
          height={20}
          src={anno1800}
          width={20}
        />
        1800
      </Button>
    </div>
  )
}
