'use client'
import * as Headless from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
import type { QueryParams } from '@/lib/constants'
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
        <div key={`${section.id}-${sectionIdx}`} className="pt-6 first:pt-0">
          <Fieldset>
            <Legend className="capitalize">{section.id}</Legend>
            <CheckboxGroup>
              {section.options.map((option, optionIdx) => (
                <CheckboxField key={`${section.id}-${option}-${optionIdx}`}>
                  <Checkbox
                    name={option}
                    value={option}
                    defaultChecked={searchParamsString?.includes(
                      `${section.id}=${option}`,
                    )}
                    data-section={section.id}
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
        name="sort"
        className="max-w-48"
        aria-placeholder=""
        defaultValue={(parsedQuery['sort'] as string) ?? undefined}
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
            key={`sort-${option}-${idx}`}
            className="capitalize"
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
        type="button"
        className="self-end lg:hidden"
        data-testid="mobile-filter-button"
        color="secondary"
        onClick={() => setIsOpen(true)}
      >
        <FunnelIcon />
      </Button>

      <MobileSidebar open={isOpen} close={() => setIsOpen(false)}>
        <FilterForm className="px-4 pt-6" />
      </MobileSidebar>
    </>
  )
}
export const Filter = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
      <FilterForm className="hidden lg:block" />

      <div className="space-y-6 lg:col-span-5">
        <div className="flex items-baseline justify-between space-x-5 space-y-6">
          <Search />

          <SortOptionsSelect />
          <MobileFilter />
        </div>

        {children}
      </div>
    </div>
  )
}
