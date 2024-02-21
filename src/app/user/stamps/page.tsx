import { PencilSquareIcon, PlusIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cache } from 'react'

import { auth } from '@/auth'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

import StampDeleteModal from './StampDeleteModal'

const getUserWithStamps = cache(async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    include: userIncludeStatement,
    where: {
      id,
    },
  })
})
const UserStampsPage = async () => {
  const session = await auth()
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await getUserWithStamps(session.user.id)

  return (
    <Container className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">
        {!user?.username ? (
          <Link href="/user/account" className="text-blue-500">
            Set username!
          </Link>
        ) : (
          <>{user.username} Stamps</>
        )}
      </h1>

      {user?.listedStamps.length === 0 ? (
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No stamps
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new stamp.
          </p>
          <div className="mt-6">
            <Link
              href="/user/create"
              className="inline-flex items-center rounded-md bg-[#6DD3C0]  px-3 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-75"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Stamp
            </Link>
          </div>
        </div>
      ) : (
        <Grid>
          {user.listedStamps.map((stamp) => (
            <div key={stamp.id} className="flex flex-col">
              <div className="mb-2 flex">
                <StampDeleteModal title={stamp.title} id={stamp.id} />

                <Link
                  className="ml-auto flex rounded-md bg-[#6DD3C0] px-4 py-2 text-sm font-bold text-[#222939] transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
                  href={`/user/${stamp.id}`}
                >
                  <PencilSquareIcon className="mr-2 h-5 w-5" /> Edit Stamp{' '}
                </Link>
              </div>

              <StampCard user={user} {...stamp} />
            </div>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default UserStampsPage
