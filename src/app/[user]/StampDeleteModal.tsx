'use client'
import { TrashIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Button,
  Modal,
  ModalActions,
  ModalDescription,
  ModalTitle,
} from '@/components/ui'
import { UserWithStamps } from '@/lib/prisma/queries'

export const StampDeleteModal = ({
  id,
  title,
}: Pick<UserWithStamps['listedStamps'][0], 'id' | 'title'>) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const deleteStamp = async () => {
    const deleteStampRes = await fetch(`/api/stamp/delete/${id}`, {
      method: 'DELETE',
    })

    if (!deleteStampRes.ok) {
      return
    }
    router.refresh()
  }
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
          <Button color="accent" onClick={deleteStamp}>
            Yes, delete
          </Button>
        </ModalActions>
      </Modal>
    </>
  )
}
