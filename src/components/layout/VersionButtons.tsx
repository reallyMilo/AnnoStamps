'use client'

import anno117 from '@/../public/anno117-icon.jpg'
import anno1800 from '@/../public/anno1800-icon.webp'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui'

export const VersionButtons = () => {
  const pathname = usePathname()
  return (
    <div className="29px py-1">
      <Button href={pathname} plain>
        <Image alt="anno 117 logo icon" height={20} src={anno117} width={20} />
        117
      </Button>
      <Button
        href={`1800.${process.env.VERCEL_PROJECT_PRODUCTION_URL + pathname}`}
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
