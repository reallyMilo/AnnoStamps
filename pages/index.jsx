import { PrismaClient } from '@prisma/client'
import Image from 'next/image'

import Grid from '@/components/Grid'
import Layout from '@/components/Layout'
const prisma = new PrismaClient()
export async function getStaticProps() {
  // Get all stamps
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
  })
  // Pass the data to the Home page
  return {
    props: {
      stamps: JSON.parse(JSON.stringify(stamps)),
    },
    revalidate: 30,
  }
}

export default function Home({ stamps = [] }) {
  return (
    <Layout>
      <div className="bg-[#606221]">
        <div className="container mx-auto grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-20">
          <div className="px-5 py-12 text-white md:py-24">
            <h1 className="text-4xl font-bold md:text-5xl">
              Stamps for Anno 1800
            </h1>
            <h2 className="text-xl md:text-4xl">Find your next layout</h2>
          </div>
          <div className="relative h-[300px] w-full max-w-[615px] md:h-auto">
            <Image
              src="/header.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 320px) 100vw"
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-5 py-12">
        <Grid stamps={stamps} />
      </div>
    </Layout>
  )
}
