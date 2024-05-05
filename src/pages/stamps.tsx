import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Filter from '@/components/Filter/Filter'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { queryParamsSchema } from '@/lib/hooks/useQueryParams'
import { StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

type StampsPageProps = {
  count: number
  pageNumber: number
  stamps: StampWithRelations[]
}

export const getServerSideProps = (async ({ query, res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=900'
  )
  const parseResult = queryParamsSchema.safeParse(query)

  if (!parseResult.success) {
    return {
      props: {
        count: 0,
        stamps: [],
        pageNumber: 1,
      },
    }
  }
  const [count, stamps, pageNumber] =
    await prisma.stamp.filterFindManyWithCount(parseResult.data)

  return {
    props: {
      count,
      stamps,
      pageNumber,
    },
  }
}) satisfies GetServerSideProps<StampsPageProps>

const StampsPage = ({
  count,
  stamps,
  pageNumber,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (stamps.length === 0) {
    return (
      <Container>
        <Filter>
          <p className="inline-flex max-w-max items-center space-x-1 rounded-md bg-amber-100 px-4 py-2 text-amber-700">
            <ExclamationCircleIcon className="mt-px h-5 w-5 shrink-0" />
            <span>No stamps found.</span>
          </p>
        </Filter>
      </Container>
    )
  }
  return (
    <Container>
      <Filter>
        <div className="flex flex-col">
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
