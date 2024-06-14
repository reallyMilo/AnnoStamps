'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'

import { Input, InputGroup } from '@/components/ui'
import { useQueryParams } from '@/lib/hooks/useQueryParams'

export const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useQueryParams()
  const defaultValue = new URLSearchParams(query ?? '').get('search')

  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
      }}
    >
      <InputGroup>
        <MagnifyingGlassIcon />
        <Input
          id="search"
          name="search"
          autoComplete="off"
          aria-label="Search"
          defaultValue={defaultValue ?? undefined}
          placeholder="Search Stamps"
        />
      </InputGroup>
    </form>
  )
}
