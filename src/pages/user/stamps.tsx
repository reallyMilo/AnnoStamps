import { Dialog, Transition } from '@headlessui/react'
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

import Grid from '@/components/Layout/Grid'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { useUserStamps } from '@/lib/hooks/useUserStamps'

const StampDeleteModal = ({
  id,
  title,
}: NonNullable<
  Pick<ReturnType<typeof useUserStamps>, 'userStamps'>['userStamps']
>['listedStamps'][0]) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const deleteStamp = async () => {
    const deleteStampRes = await fetch(`/api/stamp/${id}`, {
      method: 'DELETE',
    })

    if (!deleteStampRes.ok) {
      return
    }
    router.reload()
  }
  return (
    <>
      <button className="rounded-md px-4 py-2" onClick={() => setIsOpen(true)}>
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
const DisplayUsername = ({
  username,
}: {
  username: string | null | undefined
}) => {
  if (!username) {
    return (
      <Link
        href="/user/account"
        className="text-xl font-bold text-blue-500 underline"
      >
        Set username!
      </Link>
    )
  }

  return <h1 className="text-xl font-bold text-gray-800">{username} Stamps</h1>
}
const Stamps = () => {
  const { isLoading, error, userStamps } = useUserStamps()

  if (error) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">
          Error fetching stamps
        </h1>
        <p>{error.info.message}</p>
      </Container>
    )
  }
  if (isLoading) {
    return (
      <Container>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </Container>
    )
  }
  if (userStamps?.listedStamps.length === 0) {
    return (
      <Container>
        <DisplayUsername username={userStamps.username} />
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
      </Container>
    )
  }
  return (
    <Container>
      <DisplayUsername username={userStamps?.username} />
      <Grid>
        {userStamps?.listedStamps.map((stamp) => (
          <div key={stamp.id} className="flex flex-col">
            <div className="mb-1 flex">
              <StampDeleteModal {...stamp} />

              <Link
                className="mb-1 ml-auto flex rounded-md bg-[#6DD3C0] px-4 py-2 text-sm font-bold text-[#222939] transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
                href={{
                  pathname: `/user/[stamp]`,
                  query: { stamp: stamp.id },
                }}
              >
                <PencilSquareIcon className="mr-2 h-5 w-5" /> Edit Stamp{' '}
              </Link>
            </div>

            <StampCard user={userStamps} {...stamp} />
          </div>
        ))}
      </Grid>
    </Container>
  )
}

export default Stamps
