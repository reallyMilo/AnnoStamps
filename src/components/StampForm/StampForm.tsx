import { createId } from '@paralleldrive/cuid2'
import JSZip, { JSZipObject } from 'jszip'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Asset } from '@/lib/hooks/useUpload'
import { UserWithStamps } from '@/lib/prisma/queries'
import { upload } from '@/lib/upload'

import FileUpload from './FileUpload'
import FormInputFields from './FormInputFields'
import ImageUpload from './ImageUpload'

type Stamp = UserWithStamps['listedStamps'][0]
type Image = Stamp['images'][0]

export type StampFormContextValue = {
  files: (Asset | JSZipObject)[]
  images: (Asset | Image)[]
  setFiles: React.Dispatch<React.SetStateAction<(Asset | JSZipObject)[]>>
  setImages: React.Dispatch<React.SetStateAction<(Asset | Image)[]>>
  setStatus: React.Dispatch<
    React.SetStateAction<StampFormContextValue['status']>
  >
  stamp?: Stamp
  status: 'idle' | 'loading' | 'error' | 'success' | 'images' | 'zip'
}

const StampFormContext = React.createContext<StampFormContextValue | null>(null)

const useStampFormContext = () => {
  const context = React.useContext(StampFormContext)
  if (!context) {
    throw new Error('needs to be used within StampForm Provider')
  }
  return context
}

const Submit = ({ children }: { children: React.ReactNode }) => {
  const { status } = useStampFormContext()
  const isMutating = status === 'loading'
  const isDisabled = status === 'error' || isMutating
  return (
    <button
      type="submit"
      className="ml-auto rounded-md bg-secondary px-6 py-2 text-dark transition hover:bg-secondary/75 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
      disabled={isDisabled}
    >
      {isMutating ? 'Loading...' : children}
    </button>
  )
}

type HeaderProps = {
  subTitle: string
  title: string
}
const Header = ({ title, subTitle }: HeaderProps) => {
  return (
    <>
      <h1 className="text-xl font-medium text-gray-800">{title}</h1>
      <p className="text-gray-500">{subTitle}</p>
    </>
  )
}

export type FormProps = {
  children: React.ReactNode
  onSubmit: (
    formData: FormData,
    addImages: string[],
    removeImages?: string[]
  ) => Promise<Response>
}

const isAsset = (b: Asset | JSZipObject | Image): b is Asset => {
  return (b as Asset).rawFile !== undefined
}

const Form = ({ children, onSubmit }: FormProps) => {
  const { stamp, images, files, setStatus } = useStampFormContext()
  const [errorMessage, setErrorMessage] = React.useState<object | null>(null)
  const router = useRouter()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    if (images.length === 0) {
      setStatus('images')
      return
    }
    if (files.length === 0) {
      setStatus('zip')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.delete('images')
    formData.delete('stamps')
    const stampId = stamp?.id ?? createId()
    formData.set('stampId', stampId)

    const imagesToUpload: Asset[] = []
    const imageIdsToRemove: Image['id'][] = []

    for (const image of images) {
      if (isAsset(image)) {
        imagesToUpload.push(image)
        continue
      }
      const index = stamp?.images.findIndex((oldImg) => oldImg.id === image.id)
      if (index === -1) {
        imageIdsToRemove.push(image.id)
      }
    }

    const zip = new JSZip()
    for (const file of files) {
      if (isAsset(file)) {
        zip.file(file.name, file.rawFile)
        continue
      }
      zip.file(file.name, file.async('blob'))
    }
    const zipped = await zip.generateAsync({ type: 'blob' })
    formData.set('collection', files.length > 1 ? 'true' : 'false')

    let uploadedImageUrls: string[] = []
    let uploadedStampZipUrl: string | null = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[uploadedImageUrls, uploadedStampZipUrl] = await Promise.all([
        Promise.all(
          imagesToUpload.map(async (image) => {
            const imagePath = await upload(
              stampId,
              image.rawFile,
              image.rawFile.type,
              image.name
            )
            return imagePath
          })
        ),
        upload(stampId, zipped, 'zip', formData.get('title') as string),
      ])
    } catch (e) {
      setErrorMessage({ message: 'Error uploading assets' })
      setStatus('error')
      return
    }

    formData.set('stampFileUrl', uploadedStampZipUrl)

    const res = await onSubmit(formData, uploadedImageUrls, imageIdsToRemove)

    if (!res.ok) {
      const json = (await res.json()) as { message: object; ok: boolean }
      setErrorMessage(json.message)
      setStatus('error')
      return
    }
    setStatus('success')
    router.push('/user/stamps')
    return
  }

  return (
    <form
      className="mt-8 flex flex-col space-y-8"
      data-testid="stamp-form"
      onSubmit={handleOnSubmit}
    >
      {children}
      {errorMessage && (
        <pre>
          post this to the discord {JSON.stringify(errorMessage, undefined, 2)}
        </pre>
      )}
    </form>
  )
}

type RootProps = {
  children: React.ReactNode
  stamp?: Stamp
  zipFiles?: JSZipObject[]
}

const Root = ({ children, stamp, zipFiles }: RootProps) => {
  const [status, setStatus] =
    React.useState<StampFormContextValue['status']>('idle')

  const [images, setImages] = React.useState<StampFormContextValue['images']>(
    stamp?.images ?? []
  )

  const [files, setFiles] = React.useState<StampFormContextValue['files']>(
    zipFiles ?? []
  )

  const context = React.useMemo(
    () => ({
      status,
      setStatus,
      stamp,
      files,
      setFiles,
      images,
      setImages,
    }),
    [status, setStatus, files, setFiles, images, setImages, stamp]
  )

  return (
    <StampFormContext.Provider value={context}>
      {children}
    </StampFormContext.Provider>
  )
}

const StampForm = {
  Root,
  Form,
  Header,
  ImageUpload,
  FileUpload,
  Submit,
  FormInputFields,
}

export { StampForm, useStampFormContext }
