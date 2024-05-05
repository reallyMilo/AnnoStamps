import { Dialog, Transition } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'
import { type QueryParams, useQueryParams } from '@/lib/hooks/useQueryParams'
import { cn } from '@/lib/utils'

import Select from '../ui/Select'

const sortOptions = Object.values(SORT_OPTIONS)
const filters = [
  {
    id: 'category',
    options: Object.values(CATEGORIES),
  },
  {
    id: 'region',
    options: Object.values(REGIONS_1800),
  },
  {
    id: 'capital',
    options: Object.values(CAPITALS_1800),
  },
] satisfies {
  id: keyof QueryParams
  options: string[]
}[]

const FilterForm = ({ className }: { className: string }) => {
  const [searchParams, setQuery] = useQueryParams()

  return (
    <form
      onChange={(e) => {
        const target = e.target as HTMLInputElement

        setQuery({
          isAddParam: target.checked,
          payload: target.value,
          type: target.dataset.section as keyof QueryParams,
        })
      }}
      className={cn('space-y-6 divide-y divide-gray-200', className)}
    >
      {filters.map((section, sectionIdx) => (
        <div key={`${section.id}-${sectionIdx}`} className="pt-6 first:pt-0">
          <fieldset>
            <legend className="block text-sm font-medium capitalize text-gray-900">
              {section.id}
            </legend>
            <div className="space-y-3 pt-6">
              {section.options.map((option, optionIdx) => (
                <div
                  key={`${section.id}-${option}-${optionIdx}`}
                  className="flex items-center"
                >
                  <input
                    id={`${option}`}
                    name={`${option}`}
                    value={option}
                    type="checkbox"
                    defaultChecked={searchParams?.includes(option)}
                    data-section={section.id}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/75"
                  />
                  <label
                    htmlFor={`${option}`}
                    className="ml-3 text-sm capitalize text-dark"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
    </form>
  )
}
const MobileFilter = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        data-testid="mobile-filter-button"
        className="-m-2 ml-4 p-2 text-secondary hover:text-secondary/75 sm:ml-6 lg:hidden"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <span className="sr-only">Filters</span>
        <FunnelIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-default py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    data-testid="mobile-close-filter-button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-dark hover:text-dark/75"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <FilterForm className="px-4 pt-6" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
const Filter = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setQuery] = useQueryParams()
  const currentSortValue = new URLSearchParams(searchParams).get('sort')

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          1800 Stamps
        </h1>

        <div className="flex items-center">
          <div className="relative inline-block text-left md:ml-auto">
            <label
              htmlFor="sort"
              className={
                'absolute left-0 ml-2 -translate-y-2.5 bg-default px-1 text-sm capitalize'
              }
            >
              Sort
            </label>
            <Select
              id="sort"
              name="sort"
              options={sortOptions}
              defaultValue={currentSortValue ?? undefined}
              onChange={(e) =>
                setQuery({
                  payload: e.target.value,
                  type: 'sort',
                })
              }
            />
          </div>

          {/* <button
            type="button"
            className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
          >
            <span className="sr-only">View grid</span>
            <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
          </button> */}
          <MobileFilter />
        </div>
      </div>

      <section aria-labelledby="stamps-heading" className="pt-6">
        <h2 id="stamps-heading" className="sr-only">
          Stamps
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
          <FilterForm className="hidden lg:block" />

          <div className="lg:col-span-5">{children}</div>
        </div>
      </section>
    </div>
  )
}

export default Filter
