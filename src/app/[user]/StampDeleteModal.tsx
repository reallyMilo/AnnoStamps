'use client'
import { TrashIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

import type { UserWithStamps } from '@/lib/prisma/models'

import {
  Button,
  Modal,
  ModalActions,
  ModalDescription,
  ModalTitle,
} from '@/components/ui'

import { deleteStamp } from './actions'

export const StampDeleteModal = ({
  id,
  title,
}: Pick<UserWithStamps['listedStamps'][0], 'id' | 'title'>) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        className="cursor-pointer"
        color="accent"
        data-testid="delete-stamp"
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon />
      </Button>

      <Modal onClose={setIsOpen} open={isOpen}>
        <ModalTitle>Delete {title}?</ModalTitle>
        <ModalDescription>This action is not reversible.</ModalDescription>

        <ModalActions>
          <Button onClick={() => setIsOpen(false)} plain>
            No, cancel
          </Button>
          <Button color="accent" onClick={async () => await deleteStamp(id)}>
            Yes, delete
          </Button>
        </ModalActions>
      </Modal>
    </>
  )
}
