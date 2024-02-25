'use client'
import { createId } from '@paralleldrive/cuid2'
import JSZip, { JSZipObject } from 'jszip'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useFormStatus } from 'react-dom'

import { UserWithStamps } from '@/lib/prisma/queries'
import { upload } from '@/lib/upload'

import Fields from './Fields'
import Files from './Files'
import Images from './Images'
import { Asset } from './useUpload'

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
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="ml-auto rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
      disabled={pending}
    >
      {pending ? 'Submitting...' : children}
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
  action: (
    formData: FormData,
    addImages: Image['id'][],
    removeImages?: Image['id'][]
  ) => Promise<{ message: unknown; ok: boolean }>
  children: React.ReactNode
}

const isAsset = (b: Asset | JSZipObject | Image): b is Asset => {
  return (b as Asset).rawFile !== undefined
}

const Form = ({ children, action }: FormProps) => {
  const router = useRouter()
  const { stamp, images, files, setStatus } = useStampFormContext()

  const formAction = async (formData: FormData) => {
    if (images.length === 0) {
      setStatus('images')
      return
    }
    if (files.length === 0) {
      setStatus('zip')
      return
    }
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

    const [uploadedImageUrls, uploadedStampZipUrl] = await Promise.all([
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
      upload(stampId, zipped, 'zip'),
    ])

    formData.set('stampFileUrl', uploadedStampZipUrl)

    const mutateStamp = await action(
      formData,
      uploadedImageUrls,
      imageIdsToRemove
    )
    if (!mutateStamp.ok) {
      setStatus('error')
      return
    }
    router.push('/user/stamps')
  }

  return (
    <form className="mt-8 space-y-8" action={formAction}>
      {children}
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
  Images,
  Files,
  Submit,
  Fields,
}

export { StampForm, useStampFormContext }
