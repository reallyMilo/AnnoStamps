import { Capital1800, Category, Region1800 } from 'game/1800/enum'
import useFilterReducer from 'hooks/useFilter'
import { useRouter } from 'next/router'

import Select from '../ui/Select'

const Filter = () => {
  const { query } = useRouter()
  const initialFilterState = {
    category: (query.category as string) ?? '',
    region: (query.region as string) ?? '',
    mods: (query.modded as string) ?? 'false',
    capital: (query.capital as string) ?? '',
    tradeUnion: (query.tradeunion as string) ?? '',
    townhall: (query.townhall as string) ?? '',
    sort: (query.sort as string) ?? '',
  }
  const [filter, setFilter] = useFilterReducer(initialFilterState)

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
            options={Object.values(Category)}
            value={filter.category}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'CATEGORY' })
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
            options={Object.values(Region1800)}
            value={filter.region}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'REGION' })
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
            options={Object.values(Capital1800)}
            value={filter.capital}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'CAPITAL' })
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
            options={['downloads', 'new']}
            onChange={(e) =>
              setFilter({ payload: e.target.value, type: 'SORT' })
            }
          >
            <option value="">Most Liked</option>
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
            value={filter.mods}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={(e) =>
              setFilter({
                payload: e.target.value === 'true' ? 'false' : 'true',
                type: 'MODS',
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
            value={filter.townhall}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={(e) =>
              setFilter({
                payload: e.target.value === 'true' ? 'false' : 'true',
                type: 'TOWNHALL',
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
            value={filter.tradeUnion}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={(e) =>
              setFilter({
                payload: e.target.value === 'true' ? 'false' : 'true',
                type: 'TRADEUNION',
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Filter
