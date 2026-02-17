'use client'
import * as Headless from '@headlessui/react'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { type PropsWithChildren, Suspense, useState } from 'react'

import {
  Button,
  Checkbox,
  CheckboxField,
  CheckboxGroup,
  Fieldset,
  Input,
  InputGroup,
  Label,
  Legend,
  MobileSidebar,
  Select,
} from '@/components/ui'
import { SORT_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

import { useQueryParams } from './useQueryParams'

type FilterFormProps = {
  checkboxFilterOptions: {
    id: string
    options: string[]
  }[]
  className?: string
}
const sortOptions = Object.values(SORT_OPTIONS)

const Search = () => {
  const router = useRouter()
  const [searchParams, stringifyQuery] = useQueryParams()

  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        if (!formData.get('search')) {
          router.push(
            stringifyQuery(searchParams, {
              page: 1,
              search: null,
            }),
          )
          return
        }
        router.push(
          stringifyQuery(searchParams, {
            page: 1,
            search: formData.get('search'),
          }),
        )
      }}
    >
      <InputGroup>
        <MagnifyingGlassIcon />
        <Input
          aria-label="Search"
          autoComplete="off"
          defaultValue={searchParams?.get('search') ?? undefined}
          id="search"
          name="search"
          placeholder="Search Stamps"
        />
      </InputGroup>
    </form>
  )
}

const FilterForm = ({ checkboxFilterOptions, className }: FilterFormProps) => {
  const router = useRouter()
  const [searchParams, stringifyQuery] = useQueryParams()
  const searchParamsString = searchParams.toString().replace('+', ' ')
  return (
    <form
      aria-label="Filters"
      className={cn('space-y-6 divide-y divide-gray-200', className)}
    >
      {checkboxFilterOptions.map((section, sectionIdx) => (
        <Fieldset className="pb-6" key={`${section.id}-${sectionIdx}`}>
          <Legend className="capitalize">{section.id}</Legend>
          <CheckboxGroup>
            {section.options.map((option, optionIdx) => (
              <CheckboxField key={`${section.id}-${option}-${optionIdx}`}>
                <Checkbox
                  data-section={section.id}
                  defaultChecked={searchParamsString.includes(
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
                        stringifyQuery(searchParams, {
                          [section.id]: existingParams,
                        }),
                      )

                      return
                    }
                    const filtered = existingParams.filter(
                      (param) => param !== option,
                    )
                    router.push(
                      stringifyQuery(searchParams, {
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
      ))}
    </form>
  )
}
const SortOptionsSelect = () => {
  const router = useRouter()
  const [searchParams, stringifyQuery] = useQueryParams()

  return (
    <Headless.Field className="flex items-baseline justify-center gap-4">
      <Label>Sort</Label>
      <Select
        className="max-w-48"
        defaultValue={searchParams.get('sort') ?? undefined}
        name="sort"
        onChange={(e) =>
          router.push(
            stringifyQuery(searchParams, {
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
const MobileFilter = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
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
        {children}
      </MobileSidebar>
    </div>
  )
}

export const StampsFilterLayout = ({
  checkboxFilterOptions,
  children,
}: PropsWithChildren<{
  checkboxFilterOptions: FilterFormProps['checkboxFilterOptions']
}>) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
      <Suspense>
        <FilterForm
          checkboxFilterOptions={checkboxFilterOptions}
          className="hidden lg:block"
        />
      </Suspense>

      <div className="lg:col-span-5">
        <div className="flex items-baseline justify-between space-y-6 space-x-5">
          <Suspense>
            <Search />
            <SortOptionsSelect />
            <MobileFilter>
              <FilterForm checkboxFilterOptions={checkboxFilterOptions} />
            </MobileFilter>
          </Suspense>
        </div>

        {children}
      </div>
    </div>
  )
}
