'use client'
import { TrashIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

import {
  Button,
  Modal,
  ModalActions,
  ModalDescription,
  ModalTitle,
} from '@/components/ui'
import { UserWithStamps } from '@/lib/prisma/models'

import { deleteStamp } from './actions'

export const StampDeleteModal = ({
  id,
  title,
}: Pick<UserWithStamps['listedStamps'][0], 'id' | 'title'>) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        data-testid="delete-stamp"
        color="accent"
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon />
      </Button>

      <Modal open={isOpen} onClose={setIsOpen}>
        <ModalTitle>Delete {title}?</ModalTitle>
        <ModalDescription>This action is not reversible.</ModalDescription>

        <ModalActions>
          <Button plain onClick={() => setIsOpen(false)}>
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
