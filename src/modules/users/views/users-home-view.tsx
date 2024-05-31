import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import type { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { StampCard } from '@/components/StampCard'
import {
  Button,
  Container,
  Grid,
  Modal,
  ModalActions,
  ModalDescription,
  ModalTitle,
  Subheading,
  Text,
} from '@/components/ui'

import { UserBanner } from '../../../components/UserBanner'
import type { getStaticProps } from './users-view.getStaticProps'

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
          <Text>Get started by creating a new stamp.</Text>
          <div className="mt-6">
            <Button href={'/stamp/create'}>
              <PlusIcon />
              New Stamp
            </Button>
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
            <div className="mb-1 flex justify-between">
              <StampDeleteModal {...stamp} />

              <Button href={`/stamp/update/${stamp.id}`}>
                <PencilSquareIcon />
                Edit Stamp
              </Button>
            </div>
            <StampCard user={user} {...stamp} />
          </div>
        ))}
      </Grid>
    </Container>
  )
}

export default UserHomePage
