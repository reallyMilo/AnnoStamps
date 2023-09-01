import { PencilSquareIcon } from '@heroicons/react/20/solid'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { getSession } from 'next-auth/react'

import Grid from '@/components/Layout/Grid'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { prisma } from '@/lib/prisma/singleton'
import { StampWithRelations } from '@/types'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session?.user.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const stamps = await prisma.stamp.findMany({
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
          username: true,
          usernameURL: true,
          image: true,
        },
      },
    },
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return {
    props: {
      stamps,
    },
  }
}

const Stamps = ({ stamps }: { stamps: StampWithRelations[] }) => {
  return (
    <Container>
      <h1 className="text-xl font-bold text-gray-800">Your listings</h1>
      <Grid>
        {stamps.map((stamp) => (
          <div key={stamp.id} className="flex flex-col">
            <Link
              className="mb-1 ml-auto flex rounded-md bg-[#6DD3C0] px-4 py-2 text-sm font-bold text-[#222939] transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
              href={{
                pathname: `/user/[stamp]`,
                query: { stamp: stamp.id, author: stamp.user.id },
              }}
            >
              <PencilSquareIcon className="mr-2 h-5 w-5" /> Edit Stamp{' '}
            </Link>

            <StampCard {...stamp} />
          </div>
        ))}
      </Grid>
    </Container>
  )
}

export default Stamps
