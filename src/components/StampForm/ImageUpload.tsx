'use client'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'

import type { Image } from '@/lib/prisma/models'

import { buttonStyles, Grid, Subheading, Text } from '@/components/ui'
import { cn } from '@/lib/utils'

import { useStampFormContext } from './StampForm'
import { type Asset, useUpload } from './useUpload'

const isImage = (b: Asset | Image): b is Image => {
  return (b as Image).id !== undefined
}
//TODO: ordering of images, drag
export const ImageUpload = () => {
  const { images, setImages, status } = useStampFormContext()
  const { error, handleChange, handleRemove } = useUpload<Asset | Image>(
    images,
    setImages,
  )
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div>
          <Subheading> Upload Images </Subheading>
          <Text>First Image will be the Thumbnail, 4:3 aspect ratio</Text>
        </div>

        <label
          className={cn(
            buttonStyles.base,
            buttonStyles.solid,
            buttonStyles.colors.secondary,
            'h-fit font-normal hover:opacity-90',
          )}
          htmlFor="images"
        >
          Add Images
        </label>
      </div>
      <input
        accept=".png, .jpg, .jpeg, .webp"
        formNoValidate
        hidden
        id="images"
        multiple
        name="images"
        onChange={handleChange}
        type="file"
      />
      {images.length === 0 ? (
        <label
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
          htmlFor="images"
        >
          <ArrowUpIcon className="mx-auto h-6 w-6 text-gray-400" />

          <span className="mt-2 block text-sm font-semibold text-gray-500">
            Upload
          </span>
        </label>
      ) : (
        <Grid>
          {images.map((image) => {
            const url = isImage(image)
              ? (image.thumbnailUrl ?? image.originalUrl)
              : image.url
            return (
              <div className="relative" key={url}>
                <TrashIcon
                  className="absolute top-0 right-0 z-10 mt-2 mr-2 h-6 w-6 cursor-pointer rounded-md bg-white"
                  onClick={() => handleRemove(image)}
                />
                <div className="aspect-h-3 aspect-w-4 overflow-hidden border-2 shadow-md">
                  <img
                    alt="stamp image preview"
                    className="object-contain"
                    src={url}
                  />
                </div>
              </div>
            )
          })}
        </Grid>
      )}
      {status === 'invalidImages' && (
        <span className="text-sm text-red-600">Please add images</span>
      )}
      {error === 'size' && (
        <span className="text-sm text-red-600">
          File size exceeds 1MB or is not .png .jpg .jpeg .webp
        </span>
      )}
      {error === 'limit' && (
        <span className="text-sm text-red-600">Maximum 10 files</span>
      )}
    </div>
  )
}
