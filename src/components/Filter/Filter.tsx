'use client'
import { CAPITALS_1800, CATEGORIES, REGIONS_1800 } from '@/lib/game/1800/data'
import useFilter from '@/lib/hooks/useFilter'

import Select from '../ui/Select'

const Filter = () => {
  const [filter, setFilter] = useFilter()
  return (
    <div className="flex flex-col pb-10">
      <div className="mb-4 items-center gap-10 md:flex">
        <div className="flex items-center space-x-2 md:mb-0">
          <label htmlFor="category" className="tex-sm w-[200px] md:w-auto">
            Category
          </label>
          <Select
            id="category"
            name="category"
            options={Object.values(CATEGORIES)}
            defaultValue={filter.category}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'category' })
            }
          >
            <option value="">All</option>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="region" className="tex-sm w-[200px] md:w-auto">
            Region
          </label>
          <Select
            id="region"
            name="region"
            options={Object.values(REGIONS_1800)}
            defaultValue={filter.region}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'region' })
            }
          >
            <option value="">All</option>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="capital" className="tex-sm w-[200px] md:w-auto">
            Capital
          </label>
          <Select
            id="capital"
            name="capital"
            options={Object.values(CAPITALS_1800)}
            defaultValue={filter.capital}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'capital' })
            }
          >
            <option value="">All</option>
          </Select>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <label htmlFor="sort" className="tex-sm w-[200px] md:w-auto">
            Sort
          </label>
          <Select
            id="sort"
            name="sort"
            options={['newest', 'likes']}
            defaultValue={filter.sort}
            onChange={(e) =>
              setFilter({
                payload: e.target.value,
                type: 'sort',
              })
            }
          >
            <option value="">Downloads</option>
          </Select>
        </div>
      </div>

      <div className="items-center gap-10 md:flex">
        <div className="flex items-center space-x-2">
          <label htmlFor="modded" className="tex-sm w-[200px] md:w-auto">
            Modded
          </label>
          <input
            id="modded"
            name="modded"
            type="checkbox"
            defaultChecked={filter.modded === 'true' ? true : false}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={() =>
              setFilter({
                payload: filter.modded === 'true' ? 'false' : 'true',
                type: 'modded',
              })
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="townhall" className="tex-sm w-[200px] md:w-auto">
            Town Hall
          </label>
          <input
            id="townhall"
            name="townhall"
            type="checkbox"
            defaultChecked={filter.townhall === 'true' ? true : false}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={() =>
              setFilter({
                payload: filter.townhall === 'true' ? 'false' : 'true',
                type: 'townhall',
              })
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="trade-union" className="tex-sm w-[200px] md:w-auto">
            Trade Union
          </label>
          <input
            id="trade-union"
            name="trade-union"
            type="checkbox"
            defaultChecked={filter.tradeunion === 'true' ? true : false}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={() =>
              setFilter({
                payload: filter.tradeunion === 'true' ? 'false' : 'true',
                type: 'tradeunion',
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Filter
