import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { cn } from '@/lib/utils'

const sizeLimit = 1024 * 1024 // 1 MB

const FileUpload = () => {
  const [stamp, setStamp] = useState<{
    src: ArrayBuffer | string | null
  }>({ src: null })

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
  return (
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
  )
}

export default FileUpload
