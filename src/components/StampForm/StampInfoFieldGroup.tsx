import { useState } from 'react'

import { Field, FieldGroup, Label, Select, Textarea } from '@/components/ui'
import { CATEGORIES } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'
import { cn } from '@/lib/utils'

import { useStampFormContext } from './StampForm'

const presetCategories = Object.values(CATEGORIES)
const presetRegions = Object.values(REGIONS_1800)
const presetCapitals = Object.values(CAPITALS_1800)

export const StampInfoFieldGroup = () => {
  const { stamp } = useStampFormContext()

  const [category, setCategory] = useState(stamp?.category)

  return (
    <FieldGroup>
      <div className="flex space-x-6">
        <Field>
          <Label>Category</Label>
          <Select
            id="category"
            name="category"
            defaultValue={stamp?.category ?? ''}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category&hellip;
            </option>
            {presetCategories.map((category, idx) => (
              <option
                key={`${category}-${idx}`}
                className="capitalize"
                value={category}
              >
                {' '}
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>Region</Label>
          <Select
            id="region"
            name="region"
            defaultValue={stamp?.region ?? ''}
            required
          >
            <option value="" disabled>
              Select a region&hellip;
            </option>
            {presetRegions.map((region, idx) => (
              <option
                key={`${region}-${idx}`}
                className="capitalize"
                value={region}
              >
                {' '}
                {region}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>Mods</Label>
          <Select
            id="modded"
            name="modded"
            defaultValue={stamp?.modded.toString() ?? ''}
            required
          >
            <option value="" disabled>
              Has mods&hellip;
            </option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </Field>
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
              className={cn('', 'relative capitalize')}
            />
          </div>
        </div>
      )}

      {category === 'island' && (
        <div className="grid grid-cols-3 gap-x-4">
          <Field>
            <Label>Capital</Label>
            <Select
              id="capital"
              name="capital"
              defaultValue={stamp?.capital ?? undefined}
            >
              <option value="">Not capital</option>
              {presetCapitals.map((capital, idx) => (
                <option
                  key={`${capital}-${idx}`}
                  className="capitalize"
                  value={capital}
                >
                  {' '}
                  {capital}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <label htmlFor="title">Stamp Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter stamp title"
            className={''}
            defaultValue={stamp?.title}
            required
          />
        </div>
        <Field>
          <Label>Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder='Add some two letter fields for searching at the start of the description, see anno wiki
            production layouts for reference."'
            defaultValue={stamp?.description}
            rows={5}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}
