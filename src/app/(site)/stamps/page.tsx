import type { Metadata } from 'next'

import { StampGallery } from '@/view/StampGallery'

export const metadata: Metadata = {
  title: `117 Stamps | AnnoStamps`,
}

const StampsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return <StampGallery searchParams={{ ...searchParams, game: '117' }} />
}
export default StampsPage
