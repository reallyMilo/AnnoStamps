import { PencilSquareIcon, PlusIcon } from '@heroicons/react/20/solid'

import { StampCard } from '@/components/StampCard'
import {
  Button,
  Container,
  Grid,
  Heading,
  Subheading,
  Text,
} from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/models'

import { StampDeleteModal } from './StampDeleteModal'

/**
 * TODO: home-view additions
 *  1. Dropdown with 3 vertical dots for stamp options (edit / delete)
 *  2. Customize button that goes to /settings
 */

type UserBannerProps = {
  downloads: number
  likes: number
  stampCount: number
} & Pick<UserWithStamps, 'biography' | 'username'>

export const UserHomeBanner = ({
  username,
  biography,
  stampCount,
  downloads,
  likes,
}: UserBannerProps) => {
  return (
    <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
      <div className="flex space-x-4">
        <Heading>{username}</Heading>
        <Text className="self-end">{downloads} Downloads</Text>
        <Text className="self-end">{likes} Likes</Text>
        <Text className="self-end">{stampCount} Stamps</Text>
      </div>
      <Text className="text-sm">{biography}</Text>
    </div>
  )
}

export const UserHomePage = ({ user }: { user: UserWithStamps }) => {
  const stats = user.listedStamps.reduce(
    (acc, curr) => {
      return {
        downloads: acc.downloads + curr.downloads,
        likes: acc.likes + curr._count.likedBy,
      }
    },
    {
      downloads: 0,
      likes: 0,
    },
  )

  const { username, biography } = user
  const userBannerProps = {
    ...stats,
    username,
    biography,
    stampCount: user.listedStamps.length,
  }

  if (user.listedStamps.length === 0) {
    return (
      <Container>
        <UserHomeBanner {...userBannerProps} />
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
      <UserHomeBanner {...userBannerProps} />

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
