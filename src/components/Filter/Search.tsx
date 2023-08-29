import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import useFilterReducer from '@/lib/hooks/useFilter'

const Search = () => {
  const [filter, setFilter] = useFilterReducer()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement

    setFilter({ payload: search.value.toString(), type: 'SEARCH' })
  }
  return (
    <form className="flex items-center" onSubmit={handleSubmit}>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          defaultValue={filter.search}
          className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search Stamps"
        />
      </div>
    </form>
  )
}

export default Search
