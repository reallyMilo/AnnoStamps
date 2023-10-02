import { useState } from 'react'

import { Asset, fileToAsset } from '../utils'

const sizeLimit = 1028 * 1028 //1 mb
const fileLimit = 10

const useUpload = <T>(
  files: T[],
  setFiles: React.Dispatch<React.SetStateAction<T[]>>
) => {
  const [isError, setIsError] = useState(false)

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
    setFiles((prev) => prev.concat(assets as T[]))
  }

  const handleRemove = (fileToRemove: T) => {
    const newFiles = files.filter((file) => file !== fileToRemove)
    setFiles(newFiles)
  }

  return {
    isError,
    handleChange,
    handleRemove,
  }
}

export { useUpload }
