import { useState } from 'react'

const sizeLimit = 1028 * 1028 //1 mb
const fileLimit = 10

export type Asset = ReturnType<typeof fileToAsset>
export const fileToAsset = (rawFile: File) => {
  return {
    createdAt: new Date(rawFile.lastModified).toISOString(),
    ext: rawFile.name.split('.').pop(),
    mime: rawFile.type,
    name: rawFile.name,
    rawFile,
    size: rawFile.size / 1000,
    url: URL.createObjectURL(rawFile),
  }
}

export const useUpload = <T>(
  files: T[],
  setFiles: React.Dispatch<React.SetStateAction<T[]>>,
  limit?: number,
) => {
  const [error, setError] = useState<'limit' | 'size' | null>(null)
  const isAsset = (value: unknown): value is Asset =>
    typeof value === 'object' &&
    value !== null &&
    'rawFile' in value &&
    'url' in value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const fileList = e.currentTarget.files
    if (!fileList) {
      return
    }

    const assets: Asset[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i)
      if (!file || file.size > sizeLimit) {
        setError('size')
        return
      }
      if (files.length + assets.length >= fileLimit) {
        setError('limit')
        return
      }

      const asset = fileToAsset(file)
      assets.push(asset)
    }
    if (limit === 1) {
      setFiles([assets[assets.length - 1] as T])
      return
    }
    setFiles((prev) => prev.concat(assets as T[]))
  }

  const handleRemove = (fileToRemove: T) => {
    if (isAsset(fileToRemove)) {
      URL.revokeObjectURL(fileToRemove.url)
    }
    const newFiles = files.filter((file) => file !== fileToRemove)
    setFiles(newFiles)
  }

  return {
    error,
    handleChange,
    handleRemove,
  }
}
