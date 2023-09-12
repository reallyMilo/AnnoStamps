import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Filter from '@/components/Filter/Filter'
import Grid from '@/components/Layout/Grid'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { filterSchema } from '@/lib/hooks/useFilter'
import {
  type StampWithRelations,
  stampWithRelations,
} from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'
import {
  buildFilterWhereClause,
  buildOrderByClause,
  stampsPerPage,
} from '@/lib/utils'

type HomePageProps = {
  count: number
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

    const [count, stamps] = await prisma.$transaction([
      prisma.stamp.count({
        where: buildFilterWhereClause(filter),
      }),
      prisma.stamp.findMany({
        include: stampWithRelations,
        where: buildFilterWhereClause(filter),
        orderBy: buildOrderByClause(sort),
        skip: (pageNumber - 1) * stampsPerPage(),
        take: stampsPerPage(),
      }),
    ])

    return {
      props: {
        count,
        stamps,
      },
    }
  } catch (e) {
    //TODO: error boundary + zod error/prisma error/server error
    return {
      props: {
        count: 0,
        stamps: [],
      },
    }
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
