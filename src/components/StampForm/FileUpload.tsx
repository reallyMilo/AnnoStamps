import { JSZipObject } from 'jszip'

import { Subheading } from '@/components/ui'
import { Asset, useUpload } from '@/lib/hooks/useUpload'

import { useStampFormContext } from './StampForm'

const isJSZip = (b: Asset | JSZipObject): b is JSZipObject => {
  return (b as JSZipObject).name !== undefined
}
const FileUpload = () => {
  const { status, files, setFiles } = useStampFormContext()
  const { isError, handleChange, handleRemove } = useUpload<
    Asset | JSZipObject
  >(files, setFiles)

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between">
        <Subheading> Stamp File </Subheading>
        <label
          htmlFor="stamps"
          className="rounded-md bg-secondary px-6 py-2 text-sm text-midnight hover:bg-secondary/75 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
        >
          Add Stamps
          <input
            type="file"
            id="stamps"
            name="stamps"
            onChange={handleChange}
            multiple
            hidden
            formNoValidate
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
                  files.map((file, idx) => (
                    <tr key={`${idx}_${file.name}`}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {file.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {!isJSZip(file) && file.size} kB
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
      {status === 'zip' && (
        <span className="text-sm text-red-600">Please add stamps</span>
      )}
      {isError && (
        <span className="text-sm text-red-600">File exceeds 1 MB</span>
      )}
    </div>
  )
}

export default FileUpload
