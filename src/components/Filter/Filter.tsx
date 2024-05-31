import { FunnelIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useState } from 'react'

import {
  Button,
  Checkbox,
  CheckboxField,
  Field,
  Fieldset,
  Label,
  Legend,
  MobileSidebar,
  Select,
  Subheading,
} from '@/components/ui'
import { CATEGORIES, SORT_OPTIONS, STAMPS_PER_PAGE } from '@/lib/constants'
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
  const router = useRouter()
  const [query, setQuery] = useQueryParams()
  return (
    <form
      aria-label="Filters"
      className={cn('space-y-6 divide-y divide-gray-200', className)}
    >
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
                    defaultChecked={decodeURIComponent(query)?.includes(
                      `${section.id}=${option}`
                    )}
                    data-section={section.id}
                    onChange={(isChecked) => {
                      const existingParams = new URLSearchParams(query).getAll(
                        section.id
                      )

                      if (isChecked) {
                        existingParams.push(option)

                        router.push(
                          setQuery({
                            ...router.query,
                            [section.id]: existingParams,
                          })
                        )

                        return
                      }
                      const filtered = existingParams.filter(
                        (param) => param !== option
                      )
                      router.push(
                        setQuery({ ...router.query, [section.id]: filtered })
                      )
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
export const Filter = ({
  children,
  page,
  count,
}: React.PropsWithChildren<{ count: number; page: number }>) => {
  const router = useRouter()
  const [query, setQuery] = useQueryParams()
  const currentSortValue = new URLSearchParams(query).get('sort')
  const starting = (page - 1) * STAMPS_PER_PAGE + 1
  const ending = Math.min(starting + STAMPS_PER_PAGE - 1, count)
  return (
    <>
      <section aria-labelledby="stamps-heading" className="pt-6">
        <Subheading id="stamps-heading" className="sr-only">
          Stamps
        </Subheading>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
          <FilterForm className="hidden lg:block" />

          <div className="lg:col-span-5">
            <div className="flex items-baseline justify-between pb-6">
              <Subheading className="self-end sm:self-start">{`${starting} to ${ending} of ${count}`}</Subheading>
              <div className="flex items-center space-x-5">
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
                        router.push(
                          setQuery({ ...router.query, sort: e.target.value })
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
                  </Field>
                </div>
                <MobileFilter />
              </div>
            </div>

            {children}
          </div>
        </div>
      </section>
    </>
  )
}
