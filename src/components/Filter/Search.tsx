'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'

import { Input, InputGroup } from '@/components/ui'
import { useQueryParams } from '@/lib/hooks/useQueryParams'

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
            //@ts-expect-error route type
            stringifyQuery({
              ...parsedQuery,
              search: null,
            })
          )
          return
        }
        router.push(
          //@ts-expect-error route type
          stringifyQuery({
            ...parsedQuery,
            search: formData.get('search'),
          })
        )
      }}
    >
      <InputGroup>
        <MagnifyingGlassIcon />
        <Input
          id="search"
          name="search"
          autoComplete="off"
          aria-label="Search"
          defaultValue={searchParams?.get('search') ?? undefined}
          placeholder="Search Stamps"
        />
      </InputGroup>
    </form>
  )
}
