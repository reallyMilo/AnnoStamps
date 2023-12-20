import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Filter from '@/components/Filter/Filter'
import Grid from '@/components/Layout/Grid'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
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

  try {
    const { page, sort, ...filter } = filterSchema.parse(query)
    const pageNumber = parseInt(page || '1', 10)

    const [count, stamps] = await prisma.stamp.filterFindManyWithCount(
      filter,
      sort,
      { skip: (pageNumber - 1) * stampsPerPage(), take: stampsPerPage() }
    )

    return {
      props: {
        count,
        stamps,
        pageNumber,
      },
    }
  } catch (e) {
    //TODO: error boundary + zod error/prisma error/server error
    return {
      props: {
        count: 0,
        stamps: [],
        pageNumber: 1,
      },
    }
  }
}

const HomePage = ({
  count,
  stamps,
  pageNumber,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const initialPage = pageNumber * stampsPerPage() >= count ? 1 : pageNumber

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
          <Pagination count={count} page={initialPage} />
        </>
      )}
    </Container>
  )
}
export default HomePage
