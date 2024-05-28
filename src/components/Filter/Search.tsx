import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Input, InputGroup } from '@/components/ui'
import { useQueryParams } from '@/lib/hooks/useQueryParams'

export const Search = () => {
  const [query, setQuery] = useQueryParams()
  const defaultValue = new URLSearchParams(query).get('search')

  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        setQuery({
          payload: formData.get('search') as string,
          type: 'search',
        })
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
