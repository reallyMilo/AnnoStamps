import type { Metadata } from 'next'

import { unstable_cache } from 'next/cache'

import { StampCard } from '@/components/StampCard'
import { Container } from '@/components/ui'
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

  const parseResult = queryParamsSchema.safeParse({
    ...searchParams,
    game: '117',
  })
  const filteredStamps = await getFilteredStamps(
    parseResult.success ? parseResult.data : { game: '117' },
  )
  return (
    <Container className="space-y-6">
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
    </Container>
  )
}
export default StampsPage
