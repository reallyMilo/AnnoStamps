//TODO: refactor repeated logic and jsx when implementing edit stamp feature

import { ArrowUpIcon } from '@heroicons/react/24/outline'
import Downshift from 'downshift'
import { Capital1800, Category, Region1800 } from 'game/1800/enum'
import { getGoods } from 'game/1800/helpers'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

import { cn } from '@/lib/utils'

import Select from './ui/Select'
const items = getGoods()
const boxStyle =
  'w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-400 focus:ring-gray-400'
const errorStyle =
  'border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400'

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i
const sizeLimit = 1024 * 1024 // 1 MB

async function sendRequest(
  url: string,
  {
    arg,
  }: {
    arg: any
  }
) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

const ListingForm = () => {
  const router = useRouter()
  //FIXME: need to combine all these usestates into 1 useimmer
  const [category, setCategory] = useState('')
  const [image, setImage] = useState<{
    localUrl: string | null
    src: ArrayBuffer | string | null
  }>({ localUrl: null, src: null })
  const [stamp, setStamp] = useState<{
    src: ArrayBuffer | string | null
  }>({ src: null })
  const { trigger, isMutating } = useSWRMutation('/api/add-stamp', sendRequest)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    if (!file.type.match(imageMimeType) || file.size > sizeLimit) {
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage({
        localUrl: URL.createObjectURL(file),
        src: reader.result,
      })
    }
    reader.readAsDataURL(file)
  }
  const handleStamp = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files) {
      return
    }
    const [file] = e.target.files
    if (file.size > sizeLimit) {
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setStamp({ src: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    if (!image && !stamp) {
      alert('Screenshot and Stamp file are required')
      return
    }

    const targetField = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      region: formData.get('region'),
      good: formData.get('good') ?? 'none',
      capital: formData.get('capital') ?? 'none',
      townhall: formData.get('townhall') === 'true',
      tradeUnion: formData.get('tradeUnion') === 'true',
      modded: formData.get('modded') === 'true',
      image: image.src,
      stamp: stamp.src,
    }

    try {
      const response = await trigger(targetField)
      toast.success(response.message)
      router.push('/user/stamps')
    } catch (e) {
      let message
      if (e instanceof Error) message = e.message
      else message = String(e)

      toast.error(message)
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
              image?.localUrl
                ? 'pointer- hover:opacity-50 disabled:hover:opacity-100'
                : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200'
            )}
          >
            {image?.localUrl ? (
              <Image
                className="object-contain"
                src={image.localUrl}
                alt="screenshot"
                width={400}
                height={220}
                onClick={() => setImage({ localUrl: null, src: null })}
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
              stamp?.src
                ? 'pointer- hover:opacity-50 disabled:hover:opacity-100'
                : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200'
            )}
          >
            {stamp?.src ? (
              <button className="" onClick={() => setStamp({ src: null })}>
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
            className={cn(boxStyle)}
          >
            <option value="">-Select-</option>
          </Select>
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
                  className={cn(boxStyle, 'relative capitalize')}
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
              className={cn(boxStyle, 'capitalize')}
              id="capital"
              name="capital"
              required
            >
              <option value="">-Select-</option>
              {Object.values(Capital1800).map((capital) => (
                <option
                  className="capitalize"
                  key={`capital-${capital}`}
                  value={capital}
                >
                  {capital}
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
