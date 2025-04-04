import type { Metadata } from 'next'

import { StampGallery } from '@/view/StampGallery'

export const metadata: Metadata = {
  title: `1800 Stamps | AnnoStamps`,
}

const StampsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return <StampGallery searchParams={{ ...searchParams, game: '1800' }} />
}
export default StampsPage
