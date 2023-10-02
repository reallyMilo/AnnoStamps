import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import JSZip from 'jszip'
import * as React from 'react'

import { UserWithStamps } from '@/lib/prisma/queries'
import { Asset, fileToAsset } from '@/lib/utils'

import Grid from '../Layout/Grid'
import Fields from './Fields'

const sizeLimit = 1028 * 1028 //1 mb
const fileLimit = 10

type Stamp = UserWithStamps['listedStamps'][0]
type Image = Stamp['images'][0]

type StampFormContextValue<
  T extends Asset | Image = Asset | Image,
  U extends Asset = Asset
> = {
  files: U[]
  handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<any>
  images: T[]
  setFiles: React.Dispatch<React.SetStateAction<U[]>>
  setImages: React.Dispatch<React.SetStateAction<T[]>>
  stamp?: Stamp
  status: 'idle' | 'loading' | 'error' | 'success'
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
    const files = e.currentTarget.files
    if (!files) {
      return
    }

    const assets: Asset[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file || i > fileLimit || file.size > sizeLimit) {
        setIsError(true)
        return
      }

      const asset = fileToAsset(file)
      assets.push(asset)
    }
    setFiles((prev) => prev.concat(assets))
  }

  const handleRemove = (fileToRemove: Asset) => {
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

const Submit = () => {
  const { status } = useStampFormContext()
  const isMutating = status === 'loading'
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

const isImage = (b: Asset | Image): b is Image => {
  return (b as Image).id !== undefined
}
const Images = () => {
  const [isError, setIsError] = React.useState(false)
  const { images, setImages } = useStampFormContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) {
      return
    }

    const assets: Asset[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file || i > fileLimit || file.size > sizeLimit) {
        setIsError(true)
        return
      }

      const asset = fileToAsset(file)
      assets.push(asset)
    }
    setImages((prev) => prev.concat(assets))
  }

  const handleRemove = (fileToRemove: Asset | Image) => {
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
          {images.map((image) => {
            const url = isImage(image)
              ? image.thumbnailUrl ?? image.originalUrl
              : image.url
            return (
              <div key={url} className="relative">
                <TrashIcon
                  onClick={() => handleRemove(image)}
                  className="absolute right-0 top-0 z-10 mr-2 mt-2 h-6 w-6 cursor-pointer rounded-md bg-white"
                />
                <div className="aspect-h-9 aspect-w-16 overflow-hidden">
                  <img
                    className="object-cover"
                    alt="stamp image preview"
                    src={url}
                  />
                </div>
              </div>
            )
          })}
        </Grid>
      )}
      {isError && (
        <span className="text-sm text-red-600">
          File size exceeds 1MB or is not .png .jpg .jpeg .webp
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
  zip?: any
}

const Root = ({ children, stamp, zip }: RootProps) => {
  const [status, setStatus] =
    React.useState<StampFormContextValue['status']>('idle')

  const [images, setImages] = React.useState<StampFormContextValue['images']>(
    stamp?.images ?? []
  )

  const [files, setFiles] = React.useState<>([])

  const handleOnSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const path = stamp ? 'update' : 'create'
      setStatus('loading')

      const formData = new FormData(e.currentTarget)

      const zip = new JSZip()
      for (const file of files) {
        zip.file(file.name, file.rawFile)
      }
      formData.set('stamps', await zip.generateAsync({ type: 'blob' }))

      formData.delete('images')

      for (const image of images) {
        if (isImage(image)) {
          continue
        }
        formData.append('images', image.rawFile)
      }

      const res = await fetch('/api/stamp/' + path, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setStatus('success')
        return
      }
      setStatus('error')
    },
    [files, images, stamp]
  )

  const context = React.useMemo(
    () => ({
      status,
      handleOnSubmit,
      stamp,
      files,
      setFiles,
      images,
      setImages,
    }),
    [status, handleOnSubmit, files, setFiles, images, setImages, stamp]
  )

  //TODO: noValidate handle form validation
  return (
    <StampFormContext.Provider value={context}>
      <form
        className="mt-8 space-y-8"
        onSubmit={handleOnSubmit}
        encType="multipart/form-data"
        noValidate
      >
        {children}
      </form>
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
