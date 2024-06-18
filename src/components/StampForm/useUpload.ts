import { useState } from 'react'

const sizeLimit = 1028 * 1028 //1 mb
const fileLimit = 10

export type Asset = ReturnType<typeof fileToAsset>
const fileToAsset = (rawFile: File) => {
  return {
    size: rawFile.size / 1000,
    createdAt: new Date(rawFile.lastModified).toISOString(),
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    ext: rawFile.name.split('.').pop(),
    mime: rawFile.type,
    rawFile,
  }
}

export const useUpload = <T>(
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
