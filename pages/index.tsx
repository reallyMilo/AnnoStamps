import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import type { StampWithLikes } from 'types'

import Filter from '@/components/Filter/Filter'
import Layout from '@/components/Layout/Layout'
import { Pagination } from '@/components/Pagination'
import Grid from '@/components/Stamps/Grid'
import { prisma } from '@/lib/prisma'
import { pageSize } from '@/lib/utils'

type HomePageProps = {
  count: number
  stamps: StampWithLikes[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  query,
  res,
}) => {
  const { modded, region, category, page } = query
  const isModded = modded === 'true' ? true : false
  const pageNumber = page ?? 1

  const whereStatement = {
    modded: isModded,
    ...(region ? { region: region as string } : {}),
    ...(category ? { category: category as string } : {}),
  }

  const [count, stamps] = await prisma.$transaction([
    prisma.stamp.count({
      where: whereStatement,
    }),
    prisma.stamp.findMany({
      where: whereStatement,
      orderBy: {
        likedBy: {
          _count: 'desc',
        },
      },
      include: {
        likedBy: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
      skip: (Number(pageNumber) - 1) * pageSize(),
      take: pageSize(),
    }),
  ])

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=59'
  )

  return {
    props: {
      count,
      stamps: JSON.parse(JSON.stringify(stamps)),
    },
  }
}

export default function Home({
  count,
  stamps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-5 py-12">
        <Filter />
        {stamps.length === 0 ? (
          <p className="inline-flex max-w-max items-center space-x-1 rounded-md bg-amber-100 px-4 py-2 text-amber-700">
            <ExclamationCircleIcon className="mt-px h-5 w-5 shrink-0" />
            <span>No stamps found.</span>
          </p>
        ) : (
          <Grid stamps={stamps} />
        )}
        <Pagination count={count} />
      </div>
    </Layout>
  )
}
