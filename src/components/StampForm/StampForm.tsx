'use client'

import { createId } from '@paralleldrive/cuid2'
import JSZip, { type JSZipObjectWithData } from 'jszip'
import * as React from 'react'
import { useFormStatus } from 'react-dom'

import { Button, Heading, Text } from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/models'

import { FileUpload } from './FileUpload'
import { ImageUpload } from './ImageUpload'
import { StampInfoFieldGroup } from './StampInfoFieldGroup'
import { uploadAsset } from './uploadAsset'
import type { Asset } from './useUpload'

type Stamp = UserWithStamps['listedStamps'][0]
type Image = Stamp['images'][0]

export type StampFormContextValue = {
  files: (Asset | JSZipObjectWithData)[]
  images: (Asset | Image)[]
  setFiles: React.Dispatch<
    React.SetStateAction<(Asset | JSZipObjectWithData)[]>
  >
  setImages: React.Dispatch<React.SetStateAction<(Asset | Image)[]>>
  setStatus: React.Dispatch<
    React.SetStateAction<StampFormContextValue['status']>
  >
  stamp?: Stamp
  status: 'idle' | 'error' | 'success' | 'images' | 'zip'
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
    <Button
      type="submit"
      color="secondary"
      className="ml-auto font-normal"
      disabled={pending}
    >
      {pending ? 'Loading...' : children}
    </Button>
  )
}

type HeaderProps = {
  subTitle: string
  title: string
}
const Header = ({ title, subTitle }: HeaderProps) => {
  return (
    <div>
      <Heading>{title}</Heading>
      <Text>{subTitle}</Text>
    </div>
  )
}

const isAsset = (b: Asset | JSZipObjectWithData | Image): b is Asset => {
  return (b as Asset).rawFile !== undefined
}

const Form = ({
  children,
  action,
}: React.PropsWithChildren<{
  action: (formData: FormData) => Promise<{ message: string; ok: boolean }>
}>) => {
  const { stamp, images, files, setStatus } = useStampFormContext()

  const handleOnSubmit = async (formData: FormData) => {
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

    const [uploadedImageUrls, uploadedStampZipUrl] = await Promise.all([
      Promise.all(
        imagesToUpload.map(async (image) => {
          const imagePath = await uploadAsset(
            stampId,
            image.rawFile,
            image.rawFile.type,
            image.name
          )
          return imagePath
        })
      ),
      uploadAsset(stampId, zipped, 'zip', formData.get('title') as string),
    ])

    formData.set('stampFileUrl', uploadedStampZipUrl)
    formData.set('uploadedImageUrls', JSON.stringify(uploadedImageUrls))
    formData.set('imageIdsToRemove', JSON.stringify(imageIdsToRemove))

    const result = await action(formData)

    if (!result.ok) {
      throw new Error(result.message)
    }
  }

  return (
    <form
      className="mt-8 flex flex-col space-y-8"
      data-testid="stamp-form"
      action={handleOnSubmit}
    >
      {children}
    </form>
  )
}

type RootProps = {
  children: React.ReactNode
  stamp?: Stamp
  zipFiles?: JSZipObjectWithData[]
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
  StampInfoFieldGroup,
}

export { StampForm, useStampFormContext }
