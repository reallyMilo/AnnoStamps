import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Filter from '@/components/Filter/Filter'
import Grid from '@/components/Layout/Grid'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { getStampsAndCount } from '@/lib/prisma/queries'
import { StampWithRelations } from '@/types'

type HomePageProps = {
  count: number
  stamps: StampWithRelations[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  query,
  res,
}) => {
  const [count, stamps] = await getStampsAndCount(query)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=59'
  )

  return {
    props: {
      count,
      stamps,
    },
  }
}

const HomePage = ({
  count,
  stamps,
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
          <Pagination count={count} />
        </>
      )}
    </Container>
  )
}
export default HomePage
