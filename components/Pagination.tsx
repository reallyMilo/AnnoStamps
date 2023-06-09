//bad implementation will refactor later
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { cn, pageSize } from '@/lib/utils'

type PaginationProps = {
  count: number
}

export const Pagination = ({ count }: PaginationProps) => {
  const router = useRouter()
  const { query } = router
  const [page, setPage] = useState(1)
  const pages = Array.from(
    { length: Math.ceil(count / pageSize()) },
    (_, i) => i + 1
  )

  const incrementPage = () => {
    if (page + 1 > pages.length) return
    setPage((prev) => prev + 1)
    router.push({
      pathname: '/',
      query: { ...query, page: page + 1 },
    })
  }
  const decrementPage = () => {
    if (page - 1 < 1) return
    setPage((prev) => prev - 1)
    router.push({
      pathname: '/',
      query: { ...query, page: page - 1 },
    })
  }
  const changePage = (page: number) => {
    setPage(page)
    router.push({
      pathname: '/',
      query: { ...query, page: page },
    })
  }
  const starting = (page - 1) * pageSize() + 1
  const ending = Math.min(starting + pageSize() - 1, count)

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
              {pages.map((p) => (
                <li
                  key={p + '-pagination'}
                  className={cn(
                    'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-400 focus:z-20 focus:outline-offset-0 md:inline-flex',
                    p === page &&
                      'z-10 bg-indigo-600 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  )}
                  value={p}
                  onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                    changePage(e.currentTarget.value)
                  }
                >
                  {p}
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
