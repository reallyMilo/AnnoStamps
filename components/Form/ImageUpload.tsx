import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { cn } from 'lib/utils'
import Image from 'next/image'
import { useState } from 'react'

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i
const sizeLimit = 1024 * 1024 // 1 MB

const ImageUpload = () => {
  const [image, setImage] = useState<{
    localUrl: string | null
    src: string | null
  }>({ localUrl: null, src: null })

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
        src: reader.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
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
          <>
            <Image
              id="image-preview"
              className="object-contain"
              src={image.localUrl}
              alt="screenshot"
              width={400}
              height={220}
              onClick={() => setImage({ localUrl: null, src: null })}
              data-testid="image-upload"
            />
            <input
              hidden
              readOnly
              value={image.src ?? ''}
              name="imgSrc"
              id="imgSrc"
            />
          </>
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
  )
}

export default ImageUpload
