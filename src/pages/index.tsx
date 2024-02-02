import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Filter from '@/components/Filter/Filter'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { filterSchema } from '@/lib/hooks/useFilter'
import { StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'
import { stampsPerPage } from '@/lib/utils'

type HomePageProps = {
  count: number
  pageNumber: number
  stamps: StampWithRelations[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  query,
  res,
}) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=59'
  )

  const { page, sort, ...filter } = filterSchema.parse(query)
  const queryPageNumber = parseInt(page || '1', 10)

  const [count, stamps, resetPage] = await prisma.stamp.filterFindManyWithCount(
    filter,
    sort,
    { skip: (queryPageNumber - 1) * stampsPerPage(), take: stampsPerPage() }
  )

  const pageNumber = resetPage === 0 ? 1 : queryPageNumber
  return {
    props: {
      count,
      stamps,
      pageNumber,
    },
  }
}

const HomePage = ({
  count,
  stamps,
  pageNumber,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
