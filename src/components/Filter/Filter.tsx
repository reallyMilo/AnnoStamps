import { Switch } from '@headlessui/react'

import { CAPITALS_1800, CATEGORIES, REGIONS_1800 } from '@/lib/game/1800/data'
import { useQueryParams } from '@/lib/hooks/useQueryParams'
import { cn } from '@/lib/utils'

import Select from '../ui/Select'

const labelStyle =
  'absolute left-0 ml-2 -translate-y-2.5 bg-default px-1 text-sm capitalize'

const Filter = () => {
  const [query, setQuery] = useQueryParams()
  const isModded = query.modded === 'true' ? true : false

  return (
    <div className="mb-5 flex flex-col gap-x-10 gap-y-4 md:flex-row">
      <div className="relative">
        <label htmlFor="category" className={labelStyle}>
          Category
        </label>
        <Select
          id="category"
          name="category"
          options={Object.values(CATEGORIES)}
          defaultValue={query.category}
          onChange={(e) =>
            setQuery({ payload: e.target.value, type: 'category' })
          }
        >
          <option value="">All</option>
        </Select>
      </div>
      <div className="relative">
        <label htmlFor="region" className={labelStyle}>
          Region
        </label>
        <Select
          id="region"
          name="region"
          options={Object.values(REGIONS_1800)}
          defaultValue={query.region}
          onChange={(e) =>
            setQuery({ payload: e.target.value, type: 'region' })
          }
        >
          <option value="">All</option>
        </Select>
      </div>
      <div className="relative">
        <label htmlFor="capital" className={labelStyle}>
          Capital
        </label>
        <Select
          id="capital"
          name="capital"
          options={Object.values(CAPITALS_1800)}
          defaultValue={query.capital}
          onChange={(e) =>
            setQuery({ payload: e.target.value, type: 'capital' })
          }
        >
          <option value="">All</option>
        </Select>
      </div>

      <Switch.Group as="div" className="flex items-center space-x-2">
        <Switch.Label as="span">
          <span className="text-gray-900">Modded</span>{' '}
        </Switch.Label>
        <Switch
          id="modded"
          checked={isModded}
          onChange={() =>
            setQuery({
              payload: isModded ? 'false' : 'true',
              type: 'modded',
            })
          }
          className={cn(
            isModded ? 'bg-indigo-600' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              isModded ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
      </Switch.Group>

      <div className="relative md:ml-auto">
        <label htmlFor="sort" className={labelStyle}>
          Sort
        </label>
        <Select
          id="sort"
          name="sort"
          options={['newest', 'likes']}
          defaultValue={query.sort}
          onChange={(e) =>
            setQuery({
              payload: e.target.value,
              type: 'sort',
            })
          }
        >
          <option value="">Downloads</option>
        </Select>
      </div>
    </div>
  )
}

export default Filter
