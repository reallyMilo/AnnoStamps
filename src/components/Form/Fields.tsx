'use client'
import { useState } from 'react'

import { CAPITALS_1800, CATEGORIES, REGIONS_1800 } from '@/lib/game/1800/data'
import { cn } from '@/lib/utils'

import Select, { selectVariantStyles } from '../ui/Select'
import { useStampFormContext } from './StampForm'

const Fields = () => {
  const { stamp } = useStampFormContext()

  const [category, setCategory] = useState(stamp?.category)

  return (
    <>
      <div className="flex w-full space-x-4">
        <div>
          <label htmlFor="category">Category</label>
          <Select
            id="category"
            name="category"
            variant="primaryShadow"
            options={Object.values(CATEGORIES)}
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            required
          >
            <option value="">-Select-</option>
          </Select>
        </div>
        <div>
          <label htmlFor="region">Region</label>
          <Select
            id="region"
            name="region"
            required
            options={Object.values(REGIONS_1800)}
            defaultValue={stamp?.region}
            variant="primaryShadow"
          >
            <option value="">-Select-</option>
          </Select>
        </div>
        <div>
          <label htmlFor="modded">Uses Mods</label>
          <select
            name="modded"
            id="modded"
            className={selectVariantStyles.primaryShadow}
            defaultValue={stamp?.modded.toString()}
            required
          >
            <option value="">-Select-</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      {category === 'production' && (
        <div className="grid grid-cols-3 gap-x-4">
          <div className="relative flex flex-col space-y-1">
            <label htmlFor="good" className="text-gray-600">
              Enter Good
            </label>
            <input
              id="good"
              name="good"
              type="text"
              placeholder="Enter final good in chain"
              defaultValue={stamp?.good ?? undefined}
              required
              className={cn(
                selectVariantStyles.primaryShadow,
                'relative capitalize'
              )}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-gray-600" htmlFor="tradeUnion">
              Trade Union
            </label>
            <select
              className={selectVariantStyles.primaryShadow}
              id="tradeUnion"
              name="tradeUnion"
              defaultValue={stamp?.tradeUnion.toString()}
              required
            >
              <option value="">-Select-</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      )}
      {category === 'housing' && (
        <div className="grid grid-cols-3 gap-x-4">
          <div className="flex flex-col space-y-1">
            <label className="text-gray-600" htmlFor="townhall">
              Town Hall
            </label>
            <select
              className={selectVariantStyles.primaryShadow}
              id="townhall"
              name="townhall"
              defaultValue={stamp?.townhall.toString()}
              required
            >
              <option value="">-Select-</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      )}
      {category === 'island' && (
        <div className="grid grid-cols-3 gap-x-4">
          <div className="flex flex-col space-y-1">
            <label className="text-gray-600" htmlFor="capital">
              Capital
            </label>
            <Select
              id="capital"
              name="capital"
              options={Object.values(CAPITALS_1800)}
              className={selectVariantStyles.primaryShadow}
              defaultValue={stamp?.capital ?? undefined}
            >
              <option value="">-Select-</option>
            </Select>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <label className="text-gray-600" htmlFor="title">
            Stamp Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter stamp title"
            className={selectVariantStyles.primaryShadow}
            defaultValue={stamp?.title}
            required
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="text-gray-600" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={cn(
              selectVariantStyles.primaryShadow,
              'whitespace-pre-line'
            )}
            placeholder="Add some two letter fields for searching at the start of the description, see anno wiki
            production layouts for reference."
            defaultValue={stamp?.description}
            rows={5}
            required
          />
        </div>
      </div>
    </>
  )
}

export default Fields
