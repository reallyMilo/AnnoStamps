import type { Metadata } from 'next'

import { unstable_cache } from 'next/cache'

import { StampCard } from '@/components/StampCard'
import { Container } from '@/components/ui'
import { type QueryParams, queryParamsSchema } from '@/lib/constants'
import prisma from '@/lib/prisma/singleton'
import { StampGallery } from '@/view/StampGallery'

export const metadata: Metadata = {
  title: `1800 Stamps | AnnoStamps`,
}

const getFiltered1800Stamps = unstable_cache(
  async (query: QueryParams) => prisma.stamp.filterFindManyWithCount(query),
  ['filter1800Stamps'],
  {
    revalidate: 900,
    tags: ['filter1800Stamps'],
  },
)

const StampsPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const searchParams = await props.searchParams

  const parseResult = queryParamsSchema.safeParse({
    ...searchParams,
    game: '1800',
  })
  const filteredStamps = await getFiltered1800Stamps(
    parseResult.success ? parseResult.data : { game: '1800' },
  )
  return (
    <Container>
      <StampGallery
        paginatedStamps={{
          ...filteredStamps,
          stampsLength: filteredStamps.stamps.length,
        }}
        searchParams={{ ...searchParams, game: '1800' }}
      >
        {filteredStamps.stamps.map((stamp) => (
          <StampCard key={stamp.id} {...stamp} />
        ))}
      </StampGallery>
    </Container>
  )
}
export default StampsPage
