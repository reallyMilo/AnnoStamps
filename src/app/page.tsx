import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { cache } from 'react'

import Filter from '@/components/Filter/Filter'
import { Pagination } from '@/components/Filter/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { filterSchema, FilterState, stampsPerPage } from '@/lib/constants'
import type { StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

export const revalidate = 120 // revalidate every 2 minutes

const getFilteredStamps = cache(
  async (
    filterState: FilterState
  ): Promise<[number, StampWithRelations[], number]> => {
    const { page, sort, ...filter } = filterState
    const searchParamsPage = parseInt(page || '1', 10)
    const [count, stamps, resetPage] =
      await prisma.stamp.filterFindManyWithCount(filter, sort, {
        skip: (searchParamsPage - 1) * stampsPerPage,
        take: stampsPerPage,
      })
    const pageNumber = resetPage === 0 ? 1 : searchParamsPage

    return [count, stamps, pageNumber]
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
      <Filter />
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
          <Pagination count={count} page={pageNumber} />
        </>
      )}
    </Container>
  )
}

export default HomePage
