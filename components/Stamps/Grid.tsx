import { useSession } from 'next-auth/react'
import { useState } from 'react'

import Card from './Card'

const Grid = ({ stamps }) => {
  const { data: session, status } = useSession()

  const [regionFilter, setRegionFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modsFilter, setModsFilter] = useState('')

  const filteredData = stamps.filter((item) => {
    if (regionFilter && categoryFilter && modsFilter) {
      return (
        item.region === regionFilter &&
        item.category === categoryFilter &&
        String(item.modded) === modsFilter
      )
    } else if (categoryFilter && modsFilter) {
      return (
        item.category === categoryFilter && String(item.modded) === modsFilter
      )
    } else if (regionFilter && modsFilter) {
      return item.region === regionFilter && String(item.modded) === modsFilter
    } else if (regionFilter) {
      return item.region === regionFilter
    } else if (categoryFilter) {
      return item.category === categoryFilter
    } else if (modsFilter) {
      return String(item.modded) === modsFilter
    } else {
      return true
    }
  })

  const toggleFavorite = async (id) => {
    // TODO: Add/remove stamp from the authenticated user's favorites
  }

  return (
    <div>
      <div className="mb-10 items-center gap-10 md:flex">
        <p className="mb-3 font-bold md:mb-0">Filter:</p>
        <div className="mb-2 flex items-center space-x-2 md:mb-0">
          <label
            htmlFor="categorySelect"
            className="tex-sm w-[200px] md:w-auto"
          >
            Category
          </label>
          <select
            className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20"
            name="categorySelect"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
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
            value={modsFilter}
            onChange={(e) => setModsFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((stamp) => (
          <Card
            key={stamp.id}
            {...stamp}
            isUserAuthenticated={status}
            userSession={session}
            onClickFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

export default Grid
