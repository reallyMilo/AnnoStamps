import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

import type { QueryParams } from '@/lib/constants'

import { getSession } from '@/auth'
import { StampCard } from '@/components/StampCard'
import { Button } from '@/components/ui'
import { queryParamsSchema } from '@/lib/constants'
import prisma from '@/lib/prisma/singleton'
import { StampGallery } from '@/view/StampGallery'
import 'server-only'

import { StampDeleteModal } from './StampDeleteModal'
import { UserHomePage } from './UserHomePage'
import { UserPublicPage } from './UserPublicPage'

const getUserWithStamps = unstable_cache(
  async (user: string, query: QueryParams) =>
    prisma.user.filterFindManyWithCount({ user, ...query }),
  ['getUserWithStamps'],
  {
    revalidate: 900,
    tags: ['getUserWithStamps'],
  },
)

export const UserPageView = async ({
  params,
  searchParams,
}: {
  params: { user: string }
  searchParams: QueryParams
}) => {
  const parseResult = queryParamsSchema.safeParse(searchParams)
  const { count, pageNumber, stamps, user } = await getUserWithStamps(
    params.user,
    parseResult.success ? parseResult.data : { game: searchParams.game },
  )

  if (!user) {
    notFound()
  }

  const session = await getSession()
  const paginatedStamps = { count, pageNumber, stampsLength: stamps.length }

  return user.id === session?.userId ? (
    <UserHomePage stampsLength={stamps.length} {...user}>
      <StampGallery
        paginatedStamps={paginatedStamps}
        searchParams={searchParams}
      >
        {stamps.map((stamp) => (
          <div className="flex flex-col" key={stamp.id}>
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
      </StampGallery>
    </UserHomePage>
  ) : (
    <UserPublicPage {...user}>
      <StampGallery
        paginatedStamps={paginatedStamps}
        searchParams={searchParams}
      >
        {stamps.map((stamp) => (
          <StampCard key={stamp.id} user={user} {...stamp} />
        ))}
      </StampGallery>
    </UserPublicPage>
  )
}
