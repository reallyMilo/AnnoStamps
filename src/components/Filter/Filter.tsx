import { Dialog, Transition } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

import {
  Checkbox,
  CheckboxField,
  Field,
  Fieldset,
  Heading,
  Label,
  Legend,
  Select,
  Subheading,
} from '@/components/ui'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'
import { type QueryParams, useQueryParams } from '@/lib/hooks/useQueryParams'
import { cn } from '@/lib/utils'

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
  const [query, setQuery] = useQueryParams()

  return (
    <form className={cn('space-y-6 divide-y divide-gray-200', className)}>
      {filters.map((section, sectionIdx) => (
        <div key={`${section.id}-${sectionIdx}`} className="pt-6 first:pt-0">
          <Fieldset>
            <Legend className="capitalize">{section.id}</Legend>
            <div className="space-y-2 pt-3">
              {section.options.map((option, optionIdx) => (
                <CheckboxField key={`${section.id}-${option}-${optionIdx}`}>
                  <Checkbox
                    id={`${option}`}
                    name={`${option}`}
                    value={option}
                    defaultChecked={query?.includes(`${section.id}=${option}`)}
                    data-section={section.id}
                    onChange={(e) => {
                      setQuery({
                        isAddParam: e,
                        payload: option,
                        type: section.id,
                      })
                    }}
                  />
                  <Label className="capitalize">{option}</Label>
                </CheckboxField>
              ))}
            </div>
          </Fieldset>
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
                  <Subheading>Filters</Subheading>
                  <button
                    type="button"
                    data-testid="mobile-close-filter-button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-midnight hover:text-midnight/75"
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
  const [query, setQuery] = useQueryParams()
  const currentSortValue = new URLSearchParams(query).get('sort')

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
        <Heading>1800 Stamps</Heading>

        <div className="flex items-center">
          <div className="relative inline-block text-left md:ml-auto">
            <Field>
              <Label className="absolute left-0 z-10 ml-2 -translate-y-2.5 bg-default text-sm capitalize sm:text-sm dark:bg-transparent">
                Sort
              </Label>
              <Select
                id="sort"
                name="sort"
                className="before:bg-default"
                defaultValue={currentSortValue ?? undefined}
                onChange={(e) =>
                  setQuery({
                    payload: e.target.value,
                    type: 'sort',
                  })
                }
              >
                {sortOptions.map((option, idx) => (
                  <option
                    key={`sort-${option}-${idx}`}
                    className="capitalize"
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </Select>
            </Field>
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
        <Subheading id="stamps-heading" className="sr-only">
          Stamps
        </Subheading>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
          <FilterForm className="hidden lg:block" />

          <div className="lg:col-span-5">{children}</div>
        </div>
      </section>
    </div>
  )
}

export default Filter
