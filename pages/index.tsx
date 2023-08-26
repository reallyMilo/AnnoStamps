import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import type { StampWithLikes } from 'types'

import Filter from '@/components/Filter/Filter'
import Grid from '@/components/Layout/Grid'
import Layout from '@/components/Layout/Layout'
import { Pagination } from '@/components/Pagination'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { prisma } from '@/lib/prisma'
import { stampsPerPage } from '@/lib/utils'

type HomePageProps = {
  count: number
  stamps: Partial<StampWithLikes>[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  query,
  res,
}) => {
  //TODO: refactor when finished with filter / search and nickname page filter / search
  const {
    modded,
    region,
    category,
    page,
    capital,
    townhall,
    tradeUnion,
    sort,
    search,
  } = query

  const isModded = modded === 'true' ? true : false
  const isTownhall = townhall === 'true' ? true : false
  const isTradeUnion = tradeUnion === 'true' ? true : false
  const pageNumber = page ?? 1

  const whereStatement = {
    modded: isModded,
    ...(region ? { region: region as string } : {}),
    ...(category ? { category: category as string } : {}),
    ...(capital ? { capital: capital as string } : {}),
    ...(isTownhall ? { townhall: isTownhall } : {}),
    ...(isTradeUnion ? { tradeUnion: isTradeUnion } : {}),
    ...(search
      ? {
          title: {
            search: search as string,
          },
        }
      : {}),
  }
  const orderByStatement = (value: string) => {
    switch (value) {
      case 'newest':
        return { createdAt: 'desc' as const }

      default:
        return { downloads: 'desc' as const }
    }
  }

  const [count, stamps] = await prisma.$transaction([
    prisma.stamp.count({
      where: whereStatement,
    }),
    prisma.stamp.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        category: true,
        region: true,
        modded: true,
        likedBy: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
      where: whereStatement,
      orderBy: orderByStatement(sort as string),

      skip: (Number(pageNumber) - 1) * stampsPerPage(),
      take: stampsPerPage(),
    }),
  ])

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
    <Layout>
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
    </Layout>
  )
}
export default HomePage
