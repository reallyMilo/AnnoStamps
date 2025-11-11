import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Suspense } from 'react'
import 'server-only'

import type { PrismaClientSingleton } from '@/lib/prisma/singleton'

import { Pagination } from '@/components/Pagination'
import { StampCardSkeleton } from '@/components/StampCard'
import { StampsFilterLayout } from '@/components/StampsFilterLayout'
import { Grid, Heading, Subheading, Text } from '@/components/ui'
import { type QueryParams, STAMPS_PER_PAGE } from '@/lib/constants'
import { CATEGORIES } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'

type StampGalleryProps = {
  paginatedStamps:
    | ({ stampsLength: number } & Omit<
        Awaited<
          ReturnType<PrismaClientSingleton['stamp']['filterFindManyWithCount']>
        >,
        'stamps'
      >)
    | ({ stampsLength: number } & Omit<
        Awaited<
          ReturnType<PrismaClientSingleton['user']['filterFindManyWithCount']>
        >,
        'stamps' | 'user'
      >)
  searchParams: QueryParams
}

export const StampGallery = ({
  children,
  paginatedStamps,
  searchParams,
}: React.PropsWithChildren<StampGalleryProps>) => {
  // TODO: when we know 117 game data
  const additionalFilters =
    searchParams.game === '1800'
      ? [
          {
            id: 'region',
            options: Object.values(REGIONS_1800),
          },
          {
            id: 'capital',
            options: Object.values(CAPITALS_1800),
          },
        ]
      : []

  const checkboxFilterOptions = [
    {
      id: 'category',
      options: Object.values(CATEGORIES),
    },
    ...additionalFilters,
  ]

  const { count, pageNumber, stampsLength } = paginatedStamps
  const starting = (pageNumber - 1) * STAMPS_PER_PAGE + 1
  const ending = Math.min(starting + STAMPS_PER_PAGE - 1, count)

  return (
    <>
      <Heading className="pb-6 sm:text-4xl/8">
        {searchParams.game} Stamps
      </Heading>
      <StampsFilterLayout checkboxFilterOptions={checkboxFilterOptions}>
        <Suspense
          fallback={
            <div className="space-y-6">
              <Subheading>...</Subheading>
              <Grid>
                {[1, 2].map((i) => (
                  <StampCardSkeleton key={`stamp-card-skeleton-${i}`} />
                ))}
              </Grid>
            </div>
          }
        >
          {stampsLength === 0 ? (
            <Text className="flex space-x-2">
              <ExclamationCircleIcon className="mt-px size-5 shrink-0" />
              <span>No stamps found.</span>
            </Text>
          ) : (
            <div className="flex flex-col space-y-6">
              <Subheading>{`${starting} to ${ending} of ${count}`}</Subheading>
              <Grid>{children}</Grid>
              <Pagination count={count} page={pageNumber} />
            </div>
          )}
        </Suspense>
      </StampsFilterLayout>
    </>
  )
}
