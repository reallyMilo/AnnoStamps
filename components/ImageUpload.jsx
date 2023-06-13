import { ArrowUpIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { cn } from '@/lib/utils'

const accept = '.png, .jpg, .jpeg, .gif'
const sizeLimit = 2 * 1024 * 1024 // 2 MB

const ImageUpload = ({ image, setImage }) => {
  const pictureRef = useRef()

  const [isError, setIsError] = useState(false)

  const changeHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    const fileName = file?.name?.split('.')?.[0] ?? 'New file'

    reader.addEventListener(
      'load',
      async function () {
        try {
          setImage({ src: reader.result, alt: fileName })
        } catch (err) {
          toast.error('Unable to update image')
        }
      },
      false
    )

    if (file) {
      if (file.size <= sizeLimit) {
        reader.readAsDataURL(file)
      } else {
        setIsError(true)
      }
    }
  }

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      pictureRef.current.click()
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="py-1 font-bold" htmlFor="image">
        {' '}
        Screenshot{' '}
      </label>
      <input
        type="file"
        id="image"
        accept={accept}
        onChange={changeHandler}
        className={cn(
          'group aspect-h-9 aspect-w-16 relative overflow-hidden rounded-md border-gray-300 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          image?.src
            ? 'hover:opacity-50 disabled:hover:opacity-100'
            : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200'
        )}
      />

      {isError && (
        <span className="text-sm text-red-600">
          File size exceeds 2MB or is not {accept}
        </span>
      )}
    </div>
  )
}

export default ImageUpload

{
  /* <p className="py-1 font-bold">{label}</p>
<button
  disabled={updatingPicture}
  onClick={handleOnClickPicture}
  className={classNames(
    "relative aspect-w-16 aspect-h-9 overflow-hidden rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition group focus:outline-none border-gray-300",
    image?.src
      ? "hover:opacity-50 disabled:hover:opacity-100"
      : "border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200"
  )}
>
  {image?.src ? (
    <Image
      src={image.src}
      alt={image?.alt ?? ""}
      objectFit={objectFit}
      fill
      sizes="100vw"
    />
  ) : null}

  <div className="flex items-center justify-center">
    {!image?.src ? (
      <div className="flex flex-col items-center space-y-2">
        <div className="shrink-0 rounded-full p-2 bg-gray-200 group-hover:scale-110 group-focus:scale-110 transition">
          <ArrowUpIcon className="w-4 h-4 text-gray-500 transition" />
        </div>
        <span className="text-xs font-semibold text-gray-500 transition">
          {updatingPicture ? "Uploading..." : "Upload"}
        </span>
      </div>
    ) : null}
    <input
      ref={pictureRef}
      type="file"
      accept={accept}
      onChange={handleOnChangePicture}
      className="hidden"
    />
  </div>
</button>

{pictureError ? (
  <span className="text-red-600 text-sm">{pictureError}</span>
) : null}
</div> */
}
