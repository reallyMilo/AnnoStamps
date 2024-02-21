'use client'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'

import Grid from '@/components/ui/Grid'
import { Image } from '@/lib/prisma/queries'

import { useStampFormContext } from './StampForm'
import { Asset, useUpload } from './useUpload'

const isImage = (b: Asset | Image): b is Image => {
  return (b as Image).id !== undefined
}

const ImageUpload = () => {
  const { status, images, setImages } = useStampFormContext()
  const { isError, handleChange, handleRemove } = useUpload<Asset | Image>(
    images,
    setImages
  )
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="py-1 font-bold"> Upload Images </h2>
          <p className="text-sm text-gray-500">
            First Image will be the Thumbnail, 4:3 aspect ratio
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
        formNoValidate
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
                <div className="aspect-h-3 aspect-w-4 overflow-hidden border-2 shadow-md">
                  <img
                    className="object-contain"
                    alt="stamp image preview"
                    src={url}
                  />
                </div>
              </div>
            )
          })}
        </Grid>
      )}
      {status === 'images' && (
        <span className="text-sm text-red-600">Please add images</span>
      )}
      {isError && (
        <span className="text-sm text-red-600">
          File size exceeds 1MB or is not .png .jpg .jpeg .webp
        </span>
      )}
    </div>
  )
}

export default ImageUpload
