import type { Stamp } from '@prisma/client'
import Downshift from 'downshift'
import { GOODS_1800 } from 'game/1800/data'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import ImageUpload from '@/components/ImageUpload'
import StampUpload from '@/components/StampUpload'
import { cn } from '@/lib/utils'

type StampFields = Omit<
  Stamp,
  | 'id'
  | 'userId'
  | 'game'
  | 'createdAt'
  | 'updatedAt'
  | 'downloads'
  | 'imageUrl'
  | 'stampFileUrl'
  | 'oldLikes'
  | 'population'
>

const items = GOODS_1800
const boxStyle =
  'w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400'
const errorStyle =
  'border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400'

const ListingForm = () => {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  console.log(image)
  const handleOnSubmit = async () => {
    let toastId
    if (image && file) {
      try {
        toastId = toast.loading('Submitting...')
        // Submit data

        toast.success('Successfully submitted', { id: toastId })
        // Redirect user
      } catch (e) {
        toast.error('Unable to submit', { id: toastId })
      }
    } else {
      alert('Screenshot and Stamp file are required')
    }
  }

  return (
    <div className="mt-8">
      <div className="mb-10 grid grid-cols-2 gap-10">
        <ImageUpload image={image} setImage={setImage} />

        <StampUpload />
      </div>

      <form onSubmit={handleOnSubmit} className="space-y-8">
        <div className="flex w-full space-x-4">
          <div>
            <label htmlFor="category">Category</label>
            <br />
            <select
              id="category"
              name="category"
              autoComplete="category-name"
              className={cn(boxStyle)}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-Select-</option>
              <option value="Housing">Housing</option>
              <option value="Production">Production</option>
              <option value="Island">Whole Island</option>
              <option value="Cosmetic">Cosmetic</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label htmlFor="Region">Region</label>
            <br />
            <select required className={cn(boxStyle)}>
              <option value="">-Select-</option>
              <option value="Old World">Old World</option>
              <option value="New World">New World</option>
              <option value="Old World">Cape Trelawney</option>
              <option value="Arctic">Arctic</option>
              <option value="Enbesa">Enbesa</option>
            </select>
          </div>
          <div>
            <label htmlFor="modded">Uses Mods</label>
            <br />
            <select name="Modded" id="modded" className={cn(boxStyle)} required>
              <option value="">-Select-</option>
              <option value="TRUE">Yes</option>
              <option value="FALSE">No</option>
            </select>
          </div>
        </div>
        {category === 'Production' && (
          <div className="grid grid-cols-3 gap-x-4">
            <Downshift
              onChange={(selection) =>
                alert(
                  selection
                    ? `You selected ${selection.value}`
                    : 'Selection Cleared'
                )
              }
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
                    {...getInputProps()}
                    placeholder="Enter final good in chain"
                    id="good"
                    name="Good"
                    type="text"
                    className={cn(boxStyle, 'relative')}
                    required
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
                          //FIXME: no warning or error in console
                          /* eslint-disable react/jsx-key */
                          <li
                            className="cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-100"
                            {...getItemProps({
                              key: `${item.value}${index}`,
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
                className={cn(boxStyle)}
                id="trade-union"
                name="trade-union"
                required
              >
                <option value="">-Select-</option>
                <option value="TRUE">Yes</option>
                <option value="FALSE">No</option>
              </select>
            </div>
          </div>
        )}
        {category === 'Housing' && (
          <div className="grid grid-cols-3 gap-x-4">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-600" htmlFor="town-hall">
                Town Hall
              </label>
              <select
                className={cn(boxStyle)}
                id="town-hall"
                name="Town Hall"
                required
              >
                <option value="">-Select-</option>
                <option value="TRUE">Yes</option>
                <option value="FALSE">No</option>
              </select>
            </div>
          </div>
        )}
        {category === 'Island' && (
          <div className="grid grid-cols-3 gap-x-4">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-600" htmlFor="capital">
                Capital
              </label>
              <select
                className={cn(boxStyle)}
                id="capital"
                name="Capital"
                required
              >
                <option value="">-Select-</option>
                <option value="Crown Falls">Crown Falls</option>
                <option value="Manila">Manila</option>
              </select>
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
              name="Title"
              type="text"
              placeholder="Final Produced Good + Descriptors, see anno wiki
              production layouts for reference"
              className={cn(boxStyle)}
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-gray-600" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="Description"
              className={cn(boxStyle)}
              placeholder="Add a description for your stamp"
              rows={5}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            //disabled={disabled || !isValid}
            className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
          >
            Add Stamp
          </button>
        </div>
      </form>
    </div>
  )
}

export default ListingForm
