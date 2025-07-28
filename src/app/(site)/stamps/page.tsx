import type { Metadata } from 'next'

import { unstable_cache } from 'next/cache'
import 'server-only'

import { StampCard } from '@/components/StampCard'
import { type QueryParams, queryParamsSchema } from '@/lib/constants'
import prisma from '@/lib/prisma/singleton'
import { StampGallery } from '@/view/StampGallery'

export const metadata: Metadata = {
  title: `117 Stamps | AnnoStamps`,
}

const getFilteredStamps = unstable_cache(
  async (query: QueryParams) => prisma.stamp.filterFindManyWithCount(query),
  ['filterStamps'],
  {
    revalidate: 900,
    tags: ['filterStamps'],
  },
)

const StampsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParams = await props.searchParams

  const parseResult = queryParamsSchema.safeParse(searchParams)
  const filteredStamps = await getFilteredStamps(
    parseResult.success ? parseResult.data : {},
  )
  return (
    <StampGallery
      paginatedStamps={{
        ...filteredStamps,
        stampsLength: filteredStamps.stamps.length,
      }}
      searchParams={{ ...searchParams, game: '117' }}
    >
      {filteredStamps.stamps.map((stamp) => (
        <StampCard key={stamp.id} {...stamp} />
      ))}
    </StampGallery>
  )
}
export default StampsPage
