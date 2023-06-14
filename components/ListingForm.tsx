//TODO: refactor repeated logic and jsx when implementing edit stamp feature
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import Downshift from 'downshift'
import { CAPITAL_1800, CATEGORY, GOODS_1800, REGION_1800 } from 'game/1800/data'
import { Create1800Stamp } from 'game/1800/types'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

import { cn } from '@/lib/utils'
const items = GOODS_1800
const boxStyle =
  'w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400'
const errorStyle =
  'border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400'

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i
const sizeLimit = 1024 * 1024 // 1 MB

async function sendRequest(
  url,
  { arg }: { arg: Omit<Create1800Stamp, 'game'> }
) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

const ListingForm = () => {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [stamp, setStamp] = useState(null)
  const { trigger, isMutating } = useSWRMutation('/api/add-stamp', sendRequest)

  const handleImage = (e) => {
    const [file] = e.target.files
    if (!file.type.match(imageMimeType) || file.size > sizeLimit) {
      return
    }
    setImage(URL.createObjectURL(file))
  }
  const handleStamp = (e) => {
    const [file] = e.target.files
    if (file.size > sizeLimit) {
      return
    }
    setStamp(URL.createObjectURL(file))
  }
  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    if (!image && !stamp) {
      alert('Screenshot and Stamp file are required')
      return
    }

    const targetField = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      region: formData.get('region'),
      good: formData.get('good') as string,
      capital: formData.get('capital') as string,
      townhall: formData.get('townhall') === 'true',
      tradeUnion: formData.get('tradeUnion') === 'true',
      modded: formData.get('modded') === 'true',
      image,
      stamp,
    }

    try {
      const response = await trigger(targetField)
      console.log(response)
      toast.success('Successfully submitted')
    } catch (e) {
      toast.error('Unable to submit')
    }
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-8 space-y-8">
      <div className="mb-10 grid grid-cols-2 gap-10">
        {/* IMAGE UPLOAD */}
        <div className="flex flex-col space-y-2">
          <h2 className="py-1 font-bold"> Screenshot </h2>

          <div
            className={cn(
              'group aspect-h-9 aspect-w-16 relative overflow-hidden rounded-md border-gray-300 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              image
                ? 'pointer- hover:opacity-50 disabled:hover:opacity-100'
                : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200'
            )}
          >
            {image ? (
              <Image
                className="object-contain"
                src={image}
                alt="screenshot"
                width={400}
                height={220}
                onClick={() => setImage(null)}
              />
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-fit shrink-0 self-center rounded-full bg-gray-200 p-2 transition group-hover:scale-110 group-focus:scale-110">
                  <ArrowUpIcon className="h-4 w-4 text-gray-500 transition" />
                </div>
                <span className="text-xs font-semibold text-gray-500 transition">
                  Upload
                </span>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept=".png, .jpg, .jpeg, .webp"
                  onChange={handleImage}
                  hidden
                  required
                />
              </label>
            )}

            {false && (
              <span className="text-sm text-red-600">
                File size exceeds 1MB or is not .png .jpp .jpeg .webp
              </span>
            )}
          </div>
        </div>
        {/* STAMP UPLOAD */}
        <div className="flex flex-col space-y-2">
          <h2 className="py-1 font-bold"> Stamp File </h2>

          <div
            className={cn(
              'group aspect-h-9 aspect-w-16 relative overflow-hidden rounded-md border-gray-300 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              stamp
                ? 'pointer- hover:opacity-50 disabled:hover:opacity-100'
                : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200'
            )}
          >
            {stamp ? (
              <button className="" onClick={() => setStamp(null)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="green"
                  className="h-24 w-24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <label
                htmlFor="stamp"
                className="flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-fit shrink-0 self-center rounded-full bg-gray-200 p-2 transition group-hover:scale-110 group-focus:scale-110">
                  <ArrowUpIcon className="h-4 w-4 text-gray-500 transition" />
                </div>
                <span className="text-xs font-semibold text-gray-500 transition">
                  Upload
                </span>
                <input
                  type="file"
                  id="stamp"
                  name="stamp"
                  onChange={handleStamp}
                  hidden
                  required
                />
              </label>
            )}

            {false && (
              <span className="text-sm text-red-600">File exceeds 1Mb</span>
            )}
          </div>
        </div>
      </div>
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
            {CATEGORY.map((category) => (
              <option key={`category-${category.value}`} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="region">Region</label>
          <br />
          <select id="region" name="region" required className={cn(boxStyle)}>
            <option value="">-Select-</option>
            {REGION_1800.map((region) => (
              <option key={`region-${region.value}`} value={region.value}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="modded">Uses Mods</label>
          <br />
          <select name="modded" id="modded" className={cn(boxStyle)} required>
            <option value="">-Select-</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      {category === 'production' && (
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
                  name="good"
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
              className={cn(boxStyle)}
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
            <select
              className={cn(boxStyle)}
              id="capital"
              name="capital"
              required
            >
              <option value="">-Select-</option>
              {CAPITAL_1800.map((capital) => (
                <option key={`capital-${capital.value}`} value={capital.value}>
                  {capital.name}
                </option>
              ))}
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
            name="title"
            type="text"
            placeholder="Final Produced Good"
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
            name="description"
            className={cn(boxStyle, 'whitespace-pre-line')}
            placeholder="Add some two letter fields for searching at the start of the description, see anno wiki
            production layouts for reference."
            rows={5}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isMutating}
          className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
        >
          {isMutating ? 'Loading...' : 'Add Stamp'}
        </button>
      </div>
    </form>
  )
}

export default ListingForm
