'use client'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'

import type { StampWithRelations } from '@/lib/prisma/queries'

import { deleteStamp } from '../actions'

const StampDeleteModal = ({
  title,
  id,
}: Pick<StampWithRelations, 'id' | 'title'>) => {
  const [isOpen, setIsOpen] = useState(false)

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
                      onClick={async () => await deleteStamp(id)}
                      className="rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-400"
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

export default StampDeleteModal
