import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'

import Filter from '@/components/Filter/Filter'
import { Pagination } from '@/components/Filter/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { filterSchema, FilterState } from '@/lib/constants'
import prisma from '@/lib/prisma/singleton'

const getFilteredStamps = unstable_cache(
  async (filterState: FilterState) => {
    return prisma.stamp.filterFindManyWithCount(filterState)
  },
  ['filterStamps'],
  {
    tags: ['filterStamps'],
    revalidate: 120,
  }
)

const HomePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const result = filterSchema.safeParse(searchParams)
  const [count, stamps, pageNumber] = await getFilteredStamps(
    result.success ? result.data : {}
  )
  return (
    <Container>
      <Suspense>
        <Filter />
      </Suspense>
      {stamps.length === 0 ? (
        <p className="inline-flex max-w-max items-center space-x-1 rounded-md bg-amber-100 px-4 py-2 text-amber-700">
          <ExclamationCircleIcon className="mt-px h-5 w-5 shrink-0" />
          <span>No stamps found.</span>
        </p>
      ) : (
        <>
          <Grid>
            {stamps.map((stamp) => (
              <StampCard key={stamp.id} {...stamp} />
            ))}
          </Grid>
          <Suspense>
            <Pagination count={count} page={pageNumber} />
          </Suspense>
        </>
      )}
    </Container>
  )
}

export default HomePage
