'use client'

import anno117 from '@/../public/anno117-icon.jpg'
import anno1800 from '@/../public/anno1800-icon.webp'
import Image from 'next/image'

import { Button } from '@/components/ui'

export const VersionButtons = () => {
  return (
    <div className="29px py-1">
      <Button disabled plain>
        <Image alt="anno 117 logo icon" height={20} src={anno117} width={20} />
        Soon
      </Button>
      <Button href="/" plain>
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
