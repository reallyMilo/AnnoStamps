import type { Metadata } from 'next'

import { StampGallery } from '@/view/StampGallery'

export const metadata: Metadata = {
  title: `1800 Stamps | AnnoStamps`,
}

const StampsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParams = await props.searchParams
  return <StampGallery searchParams={{ ...searchParams, game: '1800' }} />
}
export default StampsPage
