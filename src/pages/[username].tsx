import { Dialog, Transition } from '@headlessui/react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'

import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'
import { userIncludeStatement, UserWithStamps } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'
/**
 * TODO: username page
 *  Empty state when for stamp owner has no stamps
 *  Add Dropdown that floats inside of stamp with 3 vertical dots
 *  edit stamp + delete stamp should appear in a drop down
 */
const StampDeleteModal = ({ id, title }: UserWithStamps['listedStamps'][0]) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const deleteStamp = async () => {
    const deleteStampRes = await fetch(`/api/stamp/delete/${id}`, {
      method: 'DELETE',
    })

    if (!deleteStampRes.ok) {
      return
    }
    router.reload()
  }
  return (
    <>
      <button
        data-testid="delete-stamp"
        className="rounded-md px-4 py-2"
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform space-y-5 overflow-hidden rounded-2xl bg-gray-200 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete {title}?
                  </Dialog.Title>

                  <p>This action cannot be undone.</p>
                  <div className="flex justify-between">
                    <button
                      className="rounded-md border border-black px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      No, cancel
                    </button>

                    <button
                      className="rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-400"
                      onClick={deleteStamp}
                    >
                      Yes, delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

type UsernamePageProps = {
  stats: { downloads: number; likes: number }
  user: UserWithStamps
}
const UsernamePage = ({
  user,
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession()
  const isStampOwner = user.id === session?.user.id

  return (
    <Container>
      <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
        <div className="flex space-x-4 ">
          <h1 className="text-3xl">{user?.username}</h1>
          <span className="self-end">{stats.downloads} Downloads</span>
          <span className="self-end">{stats.likes} Likes</span>
        </div>
        <p className="text-sm">{user?.biography}</p>
      </div>

      <Grid>
        {' '}
        {user.listedStamps.length === 0 ? (
          <p>User has no stamps</p>
        ) : (
          user.listedStamps.map((stamp) => {
            if (isStampOwner) {
              return (
                <div key={stamp.id} className="flex flex-col">
                  <div className="mb-1 flex">
                    <StampDeleteModal {...stamp} />

                    <Link
                      className="mb-1 ml-auto flex rounded-md bg-primary px-4 py-2 text-sm font-bold text-dark transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
                      href={{
                        pathname: `/user/[stamp]`,
                        query: { stamp: stamp.id },
                      }}
                    >
                      <PencilSquareIcon className="mr-2 h-5 w-5" /> Edit Stamp{' '}
                    </Link>
                  </div>
                  <StampCard user={user} {...stamp} />
                </div>
              )
            }

            return <StampCard key={stamp.id} user={user} {...stamp} />
          })
        )}
      </Grid>
    </Container>
  )
}

export default UsernamePage

export const getStaticPaths = (() => {
  return {
    paths: [], // add content creators here to generate path at build time
    fallback: 'blocking',
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }) => {
  if (typeof params?.username !== 'string') {
    return {
      notFound: true,
    }
  }

  const user = await prisma.user.findUnique({
    include: userIncludeStatement,
    where: { usernameURL: params.username.toLowerCase() },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const stats = user.listedStamps.reduce(
    (acc, curr) => {
      return {
        downloads: acc.downloads + curr.downloads,
        likes: acc.likes + curr.likedBy.length,
      }
    },
    {
      downloads: 0,
      likes: 0,
    }
  )
  return {
    props: {
      user,
      stats,
    },
    revalidate: 86400, // update stats daily
  }
}) satisfies GetStaticProps<UsernamePageProps>
