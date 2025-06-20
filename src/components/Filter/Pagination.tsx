'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import {
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from '@/components/ui'
import { STAMPS_PER_PAGE } from '@/lib/constants'

import { useQueryParams } from './useQueryParams'

type PaginationProps = {
  count: number
  page: number
}

// max elements for screen size 768 and greater
const maxPaginationList = 11
// paginate that does not shift number of elements
const paginate = (
  totalPageCount: number,
  currentPage: number,
): (null | number)[] => {
  if (totalPageCount <= maxPaginationList + 2) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1)
  }
  const range = Math.floor(maxPaginationList / 2)
  const isLeftGap = currentPage - range - 1 > 2
  const isRightGap = totalPageCount - currentPage - range - 1 > 2
  const pages: (null | number)[] = [1]

  let leftStartNumber
  if (isLeftGap && isRightGap) {
    leftStartNumber = currentPage - range + 1
  } else if (!isLeftGap) {
    leftStartNumber = 2
  } else {
    leftStartNumber = totalPageCount - maxPaginationList + 1
  }

  for (let inc = 0, index = 1; index <= maxPaginationList; index++) {
    if (
      (isLeftGap && index === 1) ||
      (isRightGap && index === maxPaginationList) ||
      (!isLeftGap &&
        leftStartNumber + inc !== totalPageCount &&
        index === maxPaginationList)
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
  const router = useRouter()
  const [searchParams, stringifyQuery] = useQueryParams()
  const totalPageCount = Math.ceil(count / STAMPS_PER_PAGE)
  const pageNumbers = paginate(totalPageCount, page)
  const currentPage = searchParams.get('page')
  const queryString = stringifyQuery(searchParams, { page: 1 })
  const queryWithoutPageNumber = queryString.slice(0, -1)

  useEffect(() => {
    if (page === 1 && Number(currentPage) !== 1 && currentPage) {
      router.replace(queryString)
    }
  }, [page, currentPage, queryString, router])
  return (
    <PaginationRoot>
      <PaginationPrevious
        href={page === 1 ? null : `${queryWithoutPageNumber}${page - 1}`}
      />
      <PaginationList>
        {pageNumbers.map((pageNum, idx) => {
          if (!pageNum) {
            return <PaginationGap key={`gap-${idx}-pagination`} />
          }
          return (
            <PaginationPage
              current={pageNum === page}
              href={`${queryWithoutPageNumber}${pageNum}`}
              key={pageNum + '-pagination'}
            >
              {pageNum}
            </PaginationPage>
          )
        })}
      </PaginationList>
      <PaginationNext
        href={
          page === totalPageCount
            ? null
            : `${queryWithoutPageNumber}${page + 1}`
        }
      />
    </PaginationRoot>
  )
}
