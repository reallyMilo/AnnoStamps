'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

import anno117 from '@/../public/anno117-icon.jpg'
import anno1800 from '@/../public/anno1800-icon.webp'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const versions = new Set(['1800'])
const duplicatePaths = new Set(['how-to', 'stamp', 'stamps'])

export const VersionButtons = () => {
  const pathname = usePathname()

  const buildEquivalentPath = () => {
    if (pathname === '/') {
      return {
        117: pathname,
        1800: `/1800/`,
        active: '117',
      }
    }
    const splitPathname = pathname.split('/')
    const isDuplicateRoute = duplicatePaths.has(splitPathname[1])

    if (isDuplicateRoute) {
      return {
        117: pathname,
        1800: `/1800${pathname}`,
        active: '117',
      }
    }

    const isVersionRoute = versions.has(splitPathname[1])
    if (isVersionRoute) {
      const path = splitPathname.toSpliced(0, 2)
      return {
        117: `/${path.join('/')}`,
        1800: pathname,
        active: '1800',
      }
    }

    const is1800 = pathname.includes('1800')
    return {
      117: `/${splitPathname[1]}`,
      1800: `/${splitPathname[1]}/1800`,
      active: is1800 ? '1800' : '117',
    }
  }

  const activeStyle =
    'bg-secondary dark:bg-secondary dark:data-active:bg-secondary dark:text-midnight dark:data-hover:bg-secondary data-hover:bg-secondary'

  const buttonStyle =
    'data-hover:bg-transparent data-hover:text-midnight/75 dark:hover:text-default dark:active:text-midnight dark:data-hover:bg-transparent dark:data-hover:text-default/75'
  return (
    <div className="py-1">
      <Button
        className={cn(
          buttonStyle,
          buildEquivalentPath().active === '117' && activeStyle,
        )}
        data-testid="default-version-link"
        href={buildEquivalentPath()[117]}
        plain
      >
        <Image alt="anno 117 logo icon" height={20} src={anno117} width={20} />
        117
      </Button>
      <Button
        className={cn(
          buttonStyle,
          buildEquivalentPath().active === '1800' && activeStyle,
        )}
        data-testid="1800-version-link"
        href={buildEquivalentPath()[1800]}
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
