import { PencilSquareIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

import Grid from '@/components/Layout/Grid'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import type { UserWithStamps } from '@/lib/prisma/queries'
import { displayAuthModal, fetcher } from '@/lib/utils'
const Stamps = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })
  const {
    data: userStamps,
    isLoading,
    error,
  } = useSWR<UserWithStamps>(
    status === 'authenticated' ? '/api/user' : null,
    fetcher
  )

  if (error) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <p>{error.info.message}</p>
      </Container>
    )
  }
  if (isLoading) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </Container>
    )
  }
  return (
    <Container>
      <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
      <Grid>
        {userStamps?.listedStamps.length === 0 ? (
          <p> You got no stamps</p>
        ) : (
          userStamps?.listedStamps.map((stamp) => (
            <div key={stamp.id} className="flex flex-col">
              <Link
                className="mb-1 ml-auto flex rounded-md bg-[#6DD3C0] px-4 py-2 text-sm font-bold text-[#222939] transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
                href={{
                  pathname: `/user/[stamp]`,
                  query: { stamp: stamp.id, author: session?.user.id },
                }}
              >
                <PencilSquareIcon className="mr-2 h-5 w-5" /> Edit Stamp{' '}
              </Link>

              <StampCard user={userStamps} {...stamp} />
            </div>
          ))
        )}
      </Grid>
    </Container>
  )
}

export default Stamps
