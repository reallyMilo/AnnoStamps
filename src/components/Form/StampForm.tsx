import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import type { Image } from '@prisma/client'
import * as React from 'react'
import useSWRMutation from 'swr/mutation'

import { UserWithStamps } from '@/lib/prisma/queries'
import { rawFileToAsset, sendRequest } from '@/lib/utils'

import Grid from '../Layout/Grid'
import Fields from './Fields'

const sizeLimit = 1028 * 1028 //1 mb
const fileLimit = 10

type RawFile = ReturnType<typeof rawFileToAsset>
type Stamp = UserWithStamps['listedStamps'][0]

type StampFormContextValue = {
  files: any[]
  handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<any>
  images: any[]
  isMutating: boolean
  setFiles: React.Dispatch<React.SetStateAction<any[]>>
  setImages: React.Dispatch<React.SetStateAction<any[]>>
  stamp: Stamp | undefined
}

const StampFormContext = React.createContext<StampFormContextValue | null>(null)

const useStampFormContext = () => {
  const context = React.useContext(StampFormContext)
  if (!context) {
    throw new Error('needs to be used within StampForm Provider')
  }
  return context
}

const File = () => {
  const { files, setFiles } = useStampFormContext()
  const [isError, setIsError] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) {
      return
    }
    const files = e.target.files
    const assets: RawFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file || i > fileLimit || file.size > sizeLimit) {
        setIsError(true)
        return
      }

      const asset = rawFileToAsset(file)
      assets.push(asset)
    }
    setFiles((prev) => prev.concat(assets))
  }

  const handleRemove = (fileToRemove: RawFile) => {
    const newFiles = files.filter((file) => file !== fileToRemove)
    setFiles(newFiles)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between">
        <h2 className="py-1 font-bold"> Stamp File </h2>
        <label
          htmlFor="stamps"
          className="rounded-md bg-yellow-600 px-6 py-2 text-sm text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 "
        >
          Add Stamps
          <input
            type="file"
            id="stamps"
            name="stamps"
            onChange={handleChange}
            multiple
            hidden
            required
          />
        </label>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <tbody className="divide-y divide-gray-200">
                {files.length === 0 ? (
                  <tr>
                    <td className="whitespace-nowrap bg-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Add multiple stamps
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file.url}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {file.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {file.size} kB
                      </td>
                      <td
                        onClick={() => handleRemove(file)}
                        className="relative cursor-pointer whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                      >
                        Remove<span className="sr-only">, {file.name}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isError && (
        <span className="text-sm text-red-600">File exceeds 1 MB</span>
      )}
    </div>
  )
}
type SubmitProps = {
  children: React.ReactNode
}
const Submit = () => {
  const { isMutating } = useStampFormContext()
  return (
    <button
      type="submit"
      className="ml-auto rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
      disabled={isMutating}
    >
      {isMutating ? 'Loading...' : 'Submit Stamp'}
    </button>
  )
}
type ImagesProps = {
  images?: Image[]
}
const Images = () => {
  const [isError, setIsError] = React.useState(false)
  const { images, setImages } = useStampFormContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const current = e.currentTarget
    if (!current.files) {
      return
    }
    const files = current.files
    const assets: RawFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file || i > fileLimit || file.size > sizeLimit) {
        setIsError(true)
        return
      }

      const asset = rawFileToAsset(file)
      assets.push(asset)
    }
    setImages((prev) => prev.concat(assets))
  }

  const handleRemove = (fileToRemove: RawFile) => {
    const newFiles = images.filter((file) => file !== fileToRemove)
    setImages(newFiles)
  }
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="py-1 font-bold"> Upload Images </h2>
          <p className="text-sm text-gray-500">
            First Image will be the Thumbnail
          </p>
        </div>

        <label
          htmlFor="images"
          className="h-fit self-end rounded-md bg-yellow-600 px-6 py-2 text-sm text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 "
        >
          Add Images
        </label>
      </div>
      <input
        type="file"
        id="images"
        name="images"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleChange}
        multiple
        hidden
        required
      />
      {images.length === 0 ? (
        <label
          htmlFor="image"
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUpIcon className="mx-auto h-6 w-6 text-gray-400" />

          <span className="mt-2 block text-sm font-semibold  text-gray-500">
            Upload
          </span>
        </label>
      ) : (
        <Grid>
          {images.map((file) => (
            <div key={file.thumbnailUrl ?? file.url} className="relative">
              <TrashIcon
                onClick={() => handleRemove(file)}
                className="absolute right-0 top-0 z-10 mr-2 mt-2 h-6 w-6 cursor-pointer rounded-md bg-white"
              />
              <div className="aspect-h-9 aspect-w-16 overflow-hidden">
                <img
                  className="object-cover"
                  alt="stamp image preview"
                  src={file.thumbnailUrl ?? file.url}
                />
              </div>
            </div>
          ))}
        </Grid>
      )}
      {isError && (
        <span className="text-sm text-red-600">
          File size exceeds 1MB or is not .png .jpp .jpeg .webp
        </span>
      )}
    </div>
  )
}

type HeaderProps = {
  subTitle: string
  title: string
}
const Header = ({ title, subTitle }: HeaderProps) => {
  return (
    <>
      <h1 className="text-xl font-medium text-gray-800">{title}</h1>
      <p className="text-gray-500">{subTitle}</p>
    </>
  )
}

type RootProps = {
  children: React.ReactNode
  stamp?: Stamp
}

const Root = ({ children, stamp }: RootProps) => {
  const [images, setImages] = React.useState(stamp?.images ?? [])
  const [files, setFiles] = React.useState<any[]>([])

  const { trigger, isMutating } = useSWRMutation('/api/stamp/add', sendRequest)

  const handleOnSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)

      const res = await trigger(formData)
      return res
    },
    [trigger]
  )

  const context = React.useMemo(
    () => ({
      isMutating,
      handleOnSubmit,
      stamp,
      files,
      setFiles,
      images,
      setImages,
    }),
    [isMutating, handleOnSubmit, files, setFiles, images, setImages, stamp]
  )

  return (
    <StampFormContext.Provider value={context}>
      {children}
    </StampFormContext.Provider>
  )
}

const StampForm = {
  Root,
  Header,
  Images,
  File,
  Submit,
  Fields,
}

export { StampForm, useStampFormContext }
