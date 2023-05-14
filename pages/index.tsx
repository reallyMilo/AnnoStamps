import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

import Layout from '@/components/Layout/Layout'
import Grid from '@/components/Stamps/Grid'
import { prisma } from '@/lib/prisma'

export async function getStaticProps() {
  const stamps = await prisma.stamp.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
    take: 16,
  })

  return {
    props: {
      //SWC plugin can fix this
      stamps: JSON.parse(JSON.stringify(stamps)),
    },
    revalidate: 30,
  }
}

export default function Home({ stamps = [] }) {
  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-5 py-12">
        {stamps.length === 0 ? (
          <p className="inline-flex max-w-max items-center space-x-1 rounded-md bg-amber-100 px-4 py-2 text-amber-700">
            <ExclamationCircleIcon className="mt-px h-5 w-5 shrink-0" />
            <span>Unfortunately, there is nothing to display yet.</span>
          </p>
        ) : (
          <Grid stamps={stamps} />
        )}
      </div>
    </Layout>
  )
}
