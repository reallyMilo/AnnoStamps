import Downshift from 'downshift'
import { useState } from 'react'

import { Capital1800, Category, Region1800 } from '@/lib/game/1800/enum'
import { getGoods } from '@/lib/game/1800/helpers'
import { cn } from '@/lib/utils'

import Select, { selectVariantStyles } from '../ui/Select'

const items = getGoods()

const Fields = () => {
  const [category, setCategory] = useState('')

  return (
    <>
      <div className="flex w-full space-x-4">
        <div>
          <label htmlFor="category">Category</label>
          <br />
          <Select
            id="category"
            name="category"
            variant="primaryShadow"
            options={Object.values(Category)}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-Select-</option>
          </Select>
        </div>
        <div>
          <label htmlFor="region">Region</label>
          <br />
          <Select
            id="region"
            name="region"
            required
            options={Object.values(Region1800)}
            variant="primaryShadow"
          >
            <option value="">-Select-</option>
          </Select>
        </div>
        <div>
          <label htmlFor="modded">Uses Mods</label>
          <br />
          <select
            name="modded"
            id="modded"
            className={selectVariantStyles.primaryShadow}
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
          <Downshift
            itemToString={(item) => (item ? item.value.toLowerCase() : '')}
          >
            {({
              getInputProps,
              getItemProps,
              getMenuProps,
              getLabelProps,
              inputValue,
              isOpen,
            }) => (
              <div className="relative flex flex-col space-y-1">
                <label
                  {...getLabelProps()}
                  htmlFor="good"
                  className="text-gray-600"
                >
                  Enter Good
                </label>
                <input
                  {...getInputProps({
                    id: 'good',
                    name: 'good',
                    type: 'text',
                    placeholder: 'Enter final good in chain',
                    require,
                  })}
                  className={cn(
                    selectVariantStyles.primaryShadow,
                    'relative capitalize'
                  )}
                />

                <ul
                  className="absolute end-0 right-0 top-20 max-h-80 w-44 list-none overflow-y-scroll bg-white p-0"
                  {...getMenuProps()}
                >
                  {isOpen &&
                    items
                      .filter(
                        (item) =>
                          !inputValue ||
                          item.value.includes(inputValue.toLowerCase())
                      )
                      .map((item, index) => (
                        <li
                          key={`${item.value}-${index}`}
                          className="cursor-default select-none py-2 pl-3 pr-9 capitalize hover:bg-gray-100"
                          {...getItemProps({
                            item,
                            index,
                          })}
                        >
                          {item.name}
                        </li>
                      ))}
                </ul>
              </div>
            )}
          </Downshift>
          <div className="flex flex-col space-y-1">
            <label className="text-gray-600" htmlFor="trade-union">
              Trade Union
            </label>
            <select
              className={selectVariantStyles.primaryShadow}
              id="trade-union"
              name="trade-union"
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
              options={Object.values(Capital1800)}
              className={selectVariantStyles.primaryShadow}
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
            rows={5}
            required
          />
        </div>
      </div>
    </>
  )
}

export default Fields
