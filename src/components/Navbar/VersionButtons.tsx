'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import anno117 from '@/../public/anno117-icon.jpg'
import anno1800 from '@/../public/anno1800-icon.webp'
import { Button, Heading, Strong, Text } from '@/components/ui'
import { cn } from '@/lib/utils'

const versions = new Set(['1800'])
const duplicatePaths = new Set(['how-to', 'stamp', 'stamps'])

export const VersionButtons = () => {
  const pathname = usePathname()
  const [isInfoOpen, setIsInfoOpen] = useState(false)

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

  const equivalentPath = buildEquivalentPath()

  return (
    <div className="space-y-2 py-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className={cn(
            buttonStyle,
            equivalentPath.active === '117' && activeStyle,
          )}
          data-testid="default-version-link"
          href={equivalentPath[117]}
          plain
        >
          <Image
            alt="anno 117 logo icon"
            height={20}
            src={anno117}
            width={20}
          />
          117
        </Button>
        <Button
          className={cn(
            buttonStyle,
            equivalentPath.active === '1800' && activeStyle,
          )}
          data-testid="1800-version-link"
          href={equivalentPath[1800]}
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
        <Button
          aria-controls="version-switching-info"
          aria-expanded={isInfoOpen}
          className={cn(
            'ml-1 border-amber-300 text-amber-900 data-active:bg-amber-100 data-hover:bg-amber-100 dark:border-amber-700/70 dark:text-amber-300 dark:data-active:bg-amber-950/40 dark:data-hover:bg-amber-950/40',
            isInfoOpen && 'bg-amber-100 dark:bg-amber-950/40',
          )}
          data-testid="version-info-toggle"
          onClick={() => setIsInfoOpen((current) => !current)}
          plain
        >
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
            i
          </span>
          Updates
        </Button>
      </div>

      {isInfoOpen && (
        <div
          className="max-w-3xl space-y-4 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80"
          id="version-switching-info"
        >
          <div className="space-y-2">
            <Heading className="text-lg">Version Switching Is Live</Heading>
            <Text>
              AnnoStamps now supports game versions from this header switcher.
              <Strong>
                {' '}
                Anno 1800 is the active upload version right now.
              </Strong>{' '}
              Anno 117 uploads are temporarily disabled until that stamp format
              is fully ready.
            </Text>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2">
                <Image
                  alt="Anno 117 icon"
                  height={22}
                  src={anno117}
                  width={22}
                />
                <Heading className="text-base">117</Heading>
              </div>
              <Text>
                Use this tab to browse 117 pages and prepare for upcoming
                uploads.
              </Text>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 flex items-center gap-2">
                <Image
                  alt="Anno 1800 icon"
                  height={22}
                  src={anno1800}
                  width={22}
                />
                <Heading className="text-base">1800</Heading>
              </div>
              <Text>
                Current live version for browsing, creating, and editing stamps.
              </Text>
            </div>
          </div>

          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700/60 dark:bg-amber-950/20">
            <Heading className="text-base">How To Switch Versions</Heading>
            <Text className="pt-2">
              Click <Strong>117</Strong> or <Strong>1800</Strong> to jump
              between equivalent pages.
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}
