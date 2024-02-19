'use client'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'

import type { StampWithRelations } from '@/lib/prisma/queries'

import { incrementDownloads } from './actions'

//TODO: cloudfront distribution custom domain for download attribute
const DownloadButton = ({
  id,
  title,
  stampFileUrl,
}: Pick<StampWithRelations, 'id' | 'stampFileUrl' | 'title'>) => {
  return (
    <a
      href={stampFileUrl}
      data-testid="stamp-download"
      className="inline-block rounded-md bg-[#6DD3C0] px-4 py-2 font-bold"
      onClick={async () => await incrementDownloads(id)}
      download={title}
    >
      <ArrowDownTrayIcon className="mr-2 inline-block h-6 w-6" />
      Download
    </a>
  )
}

export default DownloadButton
