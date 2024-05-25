import { Dialog, Transition } from '@headlessui/react'
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

import StampCard from '@/components/StampCard'
import { Container, Subheading } from '@/components/ui'
import Grid from '@/components/ui/Grid'

import { UserBanner } from '../../../components/UserBanner'
import { type getStaticProps } from './users-view.getStaticProps'

/**
 * TODO: home-view additions
 *  1. Dropdown with 3 vertical dots for stamp options (edit / delete)
 *  2. Customize button that goes to /settings
 */

const StampDeleteModal = ({
  id,
  title,
}: InferGetStaticPropsType<
  typeof getStaticProps
>['user']['listedStamps'][0]) => {
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

const UserHomePage = ({
  user,
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (user.listedStamps.length === 0) {
    return (
      <Container>
        <UserBanner user={user} stats={stats} />
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <Subheading level={3}>No Stamps</Subheading>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new stamp.
          </p>
          <div className="mt-6">
            <Link
              href={'/stamp/create'}
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-primary/75"
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
      <UserBanner user={user} stats={stats} />

      <Grid>
        {user.listedStamps.map((stamp) => (
          <div key={stamp.id} className="flex flex-col">
            <div className="mb-1 flex">
              <StampDeleteModal {...stamp} />

              <Link
                className="mb-1 ml-auto flex rounded-md bg-primary px-4 py-2 text-sm font-bold text-midnight transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
                href={`/stamp/update/${stamp.id}`}
              >
                <PencilSquareIcon className="mr-2 h-5 w-5" /> Edit Stamp{' '}
              </Link>
            </div>
            <StampCard user={user} {...stamp} />
          </div>
        ))}
      </Grid>
    </Container>
  )
}

export default UserHomePage
