import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import type { Stamp } from '@prisma/client'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import Filter from '@/components/Filter/Filter'
import Layout from '@/components/Layout/Layout'
import { Pagination } from '@/components/Pagination'
import Grid from '@/components/Stamps/Grid'
import { prisma } from '@/lib/prisma'

type HomePageProps = {
  count: number
  stamps: Stamp[]
}
export const PAGE_SIZE = 10

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  query,
  res,
}) => {
  // need to uriencode for prod
  const { modded, region, category, page } = query
  const isModded = modded === 'true' ? true : false
  const pageNumber = Number(page) ?? 1
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=59'
  )

  const [count, stamps] = await prisma.$transaction([
    prisma.stamp.count({
      where: {
        modded: isModded,
        ...(region ? { region: region as string } : {}),
        ...(category ? { category: category as string } : {}),
      },
    }),
    prisma.stamp.findMany({
      where: {
        modded: isModded,
        ...(region ? { region: region as string } : {}),
        ...(category ? { category: category as string } : {}),
      },
      orderBy: [
        {
          liked: 'desc',
        },
      ],
      include: {
        likedBy: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
      skip: (pageNumber - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

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
