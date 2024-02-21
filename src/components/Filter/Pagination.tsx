'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'

import { stampsPerPage } from '@/lib/constants'
import useFilter from '@/lib/hooks/useFilter'
import { cn } from '@/lib/utils'

const generatePageNumbers = (totalPageCount: number, currentPage: number) => {
  const presetMaxPageList = 20
  if (totalPageCount <= presetMaxPageList) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1)
  } else {
    const middlePage = Math.ceil(presetMaxPageList / 2)
    const startPage = Math.max(1, currentPage - middlePage + 1)
    const endPage = Math.min(startPage + presetMaxPageList - 1, totalPageCount)

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    )
  }
}

type PaginationProps = {
  count: number
  page: number
}

export const Pagination = ({ count, page }: PaginationProps) => {
  const [filter, setFilter] = useFilter()
  const { page: queryPage } = filter
  useEffect(() => {
    if (page === 1 && Number(queryPage) !== 1 && queryPage) {
      setFilter({ payload: 1, type: 'page' })
    }
  })
  const totalPageCount = Math.ceil(count / stampsPerPage)

  const pageNumbers = generatePageNumbers(totalPageCount, page)

  const incrementPage = () => {
    if (page + 1 > totalPageCount) return
    setFilter({ payload: page + 1, type: 'page' })
  }
  const decrementPage = () => {
    if (page - 1 < 1) return
    setFilter({ payload: page - 1, type: 'page' })
  }
  const changePage = (e: React.MouseEvent<HTMLLIElement>) => {
    const page = e.currentTarget.value

    setFilter({ payload: page, type: 'page' })
  }
  const starting = (page - 1) * stampsPerPage + 1
  const ending = Math.min(starting + stampsPerPage - 1, count)

  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={decrementPage}
        >
          Previous
        </button>
        <button
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={incrementPage}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{starting}</span> to{' '}
            <span className="font-medium">{ending}</span> of{' '}
            <span className="font-medium">{count}</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination">
            <ul className="isolate inline-flex cursor-pointer -space-x-px rounded-md shadow-sm">
              <li
                onClick={decrementPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </li>
              {pageNumbers.map((pageNum) => (
                <li
                  key={pageNum + '-pagination'}
                  className={cn(
                    'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-400 focus:z-20 focus:outline-offset-0 md:inline-flex',
                    pageNum === page &&
                      'z-10 bg-indigo-600 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  )}
                  value={pageNum}
                  onClick={changePage}
                >
                  {pageNum}
                </li>
              ))}
              <li
                onClick={incrementPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
