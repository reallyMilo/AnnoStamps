'use server'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'

import { Filter } from '@/components/Filter/Filter'
import { Pagination } from '@/components/Filter/Pagination'
import { StampCard } from '@/components/StampCard'
import { StampCardSkeleton } from '@/components/StampCard'
import { Container, Grid, Heading, Subheading, Text } from '@/components/ui'
import {
  type QueryParams,
  queryParamsSchema,
  STAMPS_PER_PAGE,
} from '@/lib/constants'
import { CATEGORIES } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'
import prisma from '@/lib/prisma/singleton'

type StampGalleryProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const getFilteredStamps = unstable_cache(
  async (query: QueryParams) => prisma.stamp.filterFindManyWithCount(query),
  ['filterStamps'],
  {
    revalidate: 900,
    tags: ['filterStamps'],
  },
)

const Stamps = async ({ searchParams }: StampGalleryProps) => {
  const parseResult = queryParamsSchema.safeParse(searchParams)
  const [count, stamps, pageNumber] = await getFilteredStamps(
    parseResult.success ? parseResult.data : {},
  )

  const starting = (pageNumber - 1) * STAMPS_PER_PAGE + 1
  const ending = Math.min(starting + STAMPS_PER_PAGE - 1, count)

  if (stamps.length === 0) {
    return (
      <Text>
        <ExclamationCircleIcon className="mt-px size-5 shrink-0" />
        <span>No stamps found.</span>
      </Text>
    )
  }
  return (
    <div className="flex flex-col space-y-6">
      <Subheading>{`${starting} to ${ending} of ${count}`}</Subheading>
      <Grid>
        {stamps.map((stamp) => (
          <StampCard key={stamp.id} {...stamp} />
        ))}
      </Grid>
      <Pagination count={count} page={pageNumber} />
    </div>
  )
}

export const StampGallery = ({ searchParams }: StampGalleryProps) => {
  const gameVersion =
    typeof searchParams?.game === 'string' ? searchParams.game : '117'

  const additionalFilters =
    gameVersion === '1800'
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

  return (
    <Container className="space-y-6">
      <Heading className="sm:text-4xl/8">{gameVersion} Stamps</Heading>
      <Filter checkboxFilterOptions={checkboxFilterOptions}>
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
          <Stamps searchParams={searchParams} />
        </Suspense>
      </Filter>
    </Container>
  )
}
