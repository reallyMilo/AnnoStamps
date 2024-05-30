import { useEffect } from 'react'

import {
  Pagination as PaginationRoot,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/components/ui'
import { STAMPS_PER_PAGE } from '@/lib/constants'
import { useQueryParams } from '@/lib/hooks/useQueryParams'

type PaginationProps = {
  count: number
  page: number
}

const maxPaginationList = 11

// paginate that does not shift number of elements
const paginate = (
  totalPageCount: number,
  currentPage: number
): (number | null)[] => {
  if (totalPageCount <= maxPaginationList + 2) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1)
  }
  const range = Math.floor(maxPaginationList / 2)
  const isLeftGap = currentPage - range - 1 > 2
  const isRightGap = totalPageCount - currentPage - range - 1 >= 2
  const pages: (number | null)[] = [1]

  let leftStartNumber
  if (isLeftGap && isRightGap) {
    leftStartNumber = currentPage - range + 1
  } else if (!isLeftGap) {
    leftStartNumber = 2
  } else {
    // fix: some edge cases with totalPageCount near range limit
    leftStartNumber = totalPageCount - maxPaginationList + 1
  }

  for (let index = 1, inc = 0; index <= maxPaginationList; index++) {
    if (
      (isLeftGap && index === 1) ||
      (isRightGap && index === maxPaginationList)
    ) {
      pages.push(null)
    } else {
      pages.push(leftStartNumber + inc)
      inc++
    }
  }
  pages.push(totalPageCount)
  return pages
}

export const Pagination = ({ count, page }: PaginationProps) => {
  const [query, setQuery] = useQueryParams()
  const queryPage = new URLSearchParams(query).get('page')
  useEffect(() => {
    if (page === 1 && Number(queryPage) !== 1 && queryPage) {
      setQuery({ payload: '1', type: 'page' })
    }
  })
  const totalPageCount = Math.ceil(count / STAMPS_PER_PAGE)
  const pageNumbers = paginate(totalPageCount, page)
  return (
    <PaginationRoot>
      <PaginationPrevious href={page === 1 ? null : '1'} />
      <PaginationList>
        {pageNumbers.map((pageNum, idx) => {
          if (!pageNum) {
            return <PaginationGap key={`gap-${idx}-pagination`} />
          }
          return (
            <PaginationPage
              href={'20'}
              key={pageNum + '-pagination'}
              current={pageNum === page}
            >
              {pageNum}
            </PaginationPage>
          )
        })}
      </PaginationList>
      <PaginationNext href={page === totalPageCount ? null : '10'} />
    </PaginationRoot>
  )
}
