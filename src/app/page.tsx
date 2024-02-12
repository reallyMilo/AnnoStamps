import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

import Filter from '@/components/Filter/Filter'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Grid from '@/components/ui/Grid'
import { filterSchema, stampsPerPage } from '@/lib/constants'
import prisma from '@/lib/prisma/singleton'

const HomePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const result = filterSchema.safeParse(searchParams)
  if (!result.success) {
    return '...'
  }

  const { page, sort, ...filter } = result.data
  const searchParamsNumber = parseInt(page || '1', 10)
  //RSC: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-third-party-libraries
  const [count, stamps, resetPage] = await prisma.stamp.filterFindManyWithCount(
    filter,
    sort,
    { skip: (searchParamsNumber - 1) * stampsPerPage, take: stampsPerPage }
  )

  const pageNumber = resetPage === 0 ? 1 : searchParamsNumber

  return (
    <>
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
    </>
  )
}

export default HomePage
