'use client'
import * as Headless from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'

import type { QueryParams } from '@/lib/constants'

import {
  Button,
  Checkbox,
  CheckboxField,
  CheckboxGroup,
  Fieldset,
  Label,
  Legend,
  MobileSidebar,
  Select,
} from '@/components/ui'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'
import { cn } from '@/lib/utils'

import { Search } from './Search'
import { useQueryParams } from './useQueryParams'

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
  const router = useRouter()
  const [searchParams, parsedQuery, stringifyQuery] = useQueryParams()
  const searchParamsString = searchParams?.toString()

  return (
    <form
      aria-label="Filters"
      className={cn('space-y-6 divide-y divide-gray-200', className)}
    >
      {filters.map((section, sectionIdx) => (
        <div className="pt-6 first:pt-0" key={`${section.id}-${sectionIdx}`}>
          <Fieldset>
            <Legend className="capitalize">{section.id}</Legend>
            <CheckboxGroup>
              {section.options.map((option, optionIdx) => (
                <CheckboxField key={`${section.id}-${option}-${optionIdx}`}>
                  <Checkbox
                    data-section={section.id}
                    defaultChecked={searchParamsString?.includes(
                      `${section.id}=${option}`,
                    )}
                    id={option}
                    name={option}
                    onChange={(isChecked) => {
                      const existingParams =
                        searchParams?.getAll(section.id) ?? []

                      if (isChecked) {
                        existingParams.push(option)

                        router.push(
                          stringifyQuery({
                            ...parsedQuery,
                            [section.id]: existingParams,
                          }),
                        )

                        return
                      }
                      const filtered = existingParams.filter(
                        (param) => param !== option,
                      )
                      router.push(
                        stringifyQuery({
                          ...parsedQuery,
                          [section.id]: filtered,
                        }),
                      )
                    }}
                    value={option}
                  />
                  <Label className="capitalize">{option}</Label>
                </CheckboxField>
              ))}
            </CheckboxGroup>
          </Fieldset>
        </div>
      ))}
    </form>
  )
}
const SortOptionsSelect = () => {
  const router = useRouter()
  const [, parsedQuery, stringifyQuery] = useQueryParams()

  return (
    <Headless.Field className="flex items-baseline justify-center gap-4">
      <Label>Sort</Label>
      <Select
        className="max-w-48"
        defaultValue={(parsedQuery['sort'] as string) ?? undefined}
        name="sort"
        onChange={(e) =>
          router.push(
            stringifyQuery({
              ...parsedQuery,
              sort: e.target.value,
            }),
          )
        }
      >
        {sortOptions.map((option, idx) => (
          <option
            className="capitalize"
            key={`sort-${option}-${idx}`}
            value={option}
          >
            {option}
          </option>
        ))}
      </Select>
    </Headless.Field>
  )
}
const MobileFilter = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        className="self-end lg:hidden"
        color="secondary"
        data-testid="mobile-filter-button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <FunnelIcon />
      </Button>

      <MobileSidebar close={() => setIsOpen(false)} open={isOpen}>
        <FilterForm className="px-4 pt-6" />
      </MobileSidebar>
    </>
  )
}
export const Filter = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
      <Suspense>
        <FilterForm className="hidden lg:block" />
      </Suspense>

      <div className="space-y-6 lg:col-span-5">
        <div className="flex items-baseline justify-between space-x-5 space-y-6">
          <Suspense>
            <Search />
            <SortOptionsSelect />
            <MobileFilter />
          </Suspense>
        </div>

        {children}
      </div>
    </div>
  )
}
