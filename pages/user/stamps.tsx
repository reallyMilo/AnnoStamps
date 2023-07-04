import type { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { StampWithLikes } from 'types'

import Grid from '@/components/Layout/Grid'
import Layout from '@/components/Layout/Layout'
import StampCard from '@/components/StampCard'
import { prisma } from '@/lib/prisma'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const stamps = await prisma.stamp.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: 'desc' },
    include: {
      likedBy: true,
    },
  })

  return {
    props: {
      stamps: JSON.parse(JSON.stringify(stamps)),
    },
  }
}

const Stamps = ({ stamps }: { stamps: StampWithLikes[] }) => {
  return (
    <Layout>
      <h1 className="container mx-auto mt-12 max-w-7xl px-5 text-xl font-bold text-gray-800">
        Your listings
      </h1>

      <div className="container mx-auto max-w-7xl px-5 py-12">
        <Grid>
          {stamps.map((stamp) => (
            <StampCard key={stamp.id} {...stamp} />
          ))}
        </Grid>
      </div>
    </Layout>
  )
}

export default Stamps
