'use client'

import { useState } from 'react'

import type { StampWithRelations } from '@/lib/prisma/models'

import {
  Button,
  Link,
  Modal,
  ModalActions,
  ModalDescription,
  ModalTitle,
} from '@/components/ui'

export const StampDownloadDisclaimer = ({
  changedAt,
  children,
}: React.PropsWithChildren<{
  changedAt: StampWithRelations['changedAt']
}>) => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const changedAtDate = new Date(changedAt)
  const [isOpen, setIsOpen] = useState(false)

  if (changedAtDate > oneWeekAgo) {
    return (
      <>
        <Button color="accent" onClick={() => setIsOpen(true)} type="button">
          Download
        </Button>
        <Modal className="z-50" onClose={setIsOpen} open={isOpen}>
          <ModalTitle>
            This stamp has been recently uploaded or changed!
          </ModalTitle>
          <ModalDescription>
            AnnoStamps does not check the contents of the uploaded file. Please
            be careful extracting the downloaded file, and report issue to our{' '}
            <Link
              className="underline"
              href="https://discord.gg/73hfP54qXe"
              htmlLink
            >
              Discord
            </Link>
            .
          </ModalDescription>
          <ModalActions>
            <Button onClick={() => setIsOpen(false)} plain>
              Cancel
            </Button>{' '}
            {children}
          </ModalActions>
        </Modal>
      </>
    )
  }

  return <>{children}</>
}
