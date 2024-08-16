'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'

import { Input, InputGroup } from '@/components/ui'

import { useQueryParams } from './useQueryParams'

export const Search = () => {
  const router = useRouter()
  const [searchParams, parsedQuery, stringifyQuery] = useQueryParams()

  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        if (!formData.get('search')) {
          router.push(
            stringifyQuery({
              ...parsedQuery,
              search: null,
            }),
          )
          return
        }
        router.push(
          stringifyQuery({
            ...parsedQuery,
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
