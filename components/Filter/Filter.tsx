import useFilterReducer from 'hooks/useFilter'
import { useRouter } from 'next/router'
const Filter = () => {
  const { query } = useRouter()
  const initialFilterState = {
    category: (query.category as string) ?? '',
    region: (query.region as string) ?? '',
    mods: (query.modded as string) ?? 'false',
  }
  const [filter, setFilter] = useFilterReducer(initialFilterState)

  return (
    <div className="mb-10 items-center gap-10 md:flex">
      <p className="mb-3 font-bold md:mb-0">Filter:</p>
      <div className="mb-2 flex items-center space-x-2 md:mb-0">
        <label htmlFor="categorySelect" className="tex-sm w-[200px] md:w-auto">
          Category
        </label>
        <select
          className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20"
          name="categorySelect"
          value={filter.category}
          onChange={(e) =>
            setFilter({ payload: e.target.value, type: 'CATEGORY' })
          }
        >
          <option value="">All</option>
          <option value="Housing">Housing</option>
          <option value="Production Chain">Production Chain</option>
          <option value="Farm">Farm</option>
          <option value="Cosmetic">Cosmetic/Beauty Build</option>
          <option value="General">General</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="regionSelect" className="tex-sm w-[200px] md:w-auto">
          Region
        </label>
        <select
          className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20"
          name="regionSelect"
          value={filter.region}
          onChange={(e) =>
            setFilter({ payload: e.target.value, type: 'REGION' })
          }
        >
          <option value="">All</option>
          <option value="Old World">Old World</option>
          <option value="New World">New World</option>
          <option value="Cape Trelawney">Cape Trelawney</option>
          <option value="Arctic">Arctic</option>
          <option value="Enbesa">Enbesa</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="regionSelect" className="tex-sm w-[200px] md:w-auto">
          Mods
        </label>
        <select
          className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20"
          name="regionSelect"
          value={filter.mods}
          onChange={(e) => setFilter({ payload: e.target.value, type: 'MODS' })}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
    </div>
  )
}

export default Filter
