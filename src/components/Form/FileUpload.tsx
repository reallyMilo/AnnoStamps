import { useUpload } from '@/lib/hooks/useUpload'

const FileUpload = () => {
  const { isError, files, handleChange, handleRemove } = useUpload()
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
                {files.map((file) => (
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
                ))}
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

export default FileUpload
