import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { unstable_cache } from 'next/cache'

import { Filter } from '@/components/Filter/Filter'
import { Pagination } from '@/components/Filter/Pagination'
import { StampCard } from '@/components/StampCard'
import { Container, Grid, Heading, Text } from '@/components/ui'
import { type QueryParams, queryParamsSchema } from '@/lib/constants'
import prisma from '@/lib/prisma/singleton'

const getFilteredStamps = unstable_cache(
  async (query: QueryParams) => {
    return prisma.stamp.filterFindManyWithCount(query)
  },
  ['filterStamps'],
  {
    tags: ['filterStamps'],
    revalidate: 900,
  }
)

const StampsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const parseResult = queryParamsSchema.safeParse(searchParams)
  const [count, stamps, pageNumber] = await getFilteredStamps(
    parseResult.success ? parseResult.data : {}
  )
  if (stamps.length === 0) {
    return (
      <Container>
        <Heading className="sm:text-4xl/8">1800 Stamps</Heading>
        <Filter count={0} page={0}>
          <Text>
            <ExclamationCircleIcon className="mt-px h-5 w-5 shrink-0" />
            <span>No stamps found.</span>
          </Text>
        </Filter>
      </Container>
    )
  }
  return (
    <Container>
      <Heading className="sm:text-4xl/8">1800 Stamps</Heading>
      <Filter page={pageNumber} count={count}>
        <div className="flex flex-col space-y-6">
          <Grid>
            {stamps.map((stamp) => (
              <StampCard key={stamp.id} {...stamp} />
            ))}
          </Grid>
          <Pagination count={count} page={pageNumber} />
        </div>
      </Filter>
    </Container>
  )
}
export default StampsPage
