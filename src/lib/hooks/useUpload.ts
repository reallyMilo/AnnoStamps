import { useState } from 'react'

import { rawFileToAsset } from '../utils'

type RawFile = ReturnType<typeof rawFileToAsset>

const sizeLimit = 1028 * 1028 //1 mb
const fileLimit = 10

const useUpload = (initialState = []) => {
  const [isError, setIsError] = useState(false)

  const [files, setFiles] = useState<RawFile[]>(initialState)

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

  return {
    isError,
    files,
    handleChange,
    handleRemove,
  }
}

export { useUpload }
