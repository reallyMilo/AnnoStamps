'use client'

import { createId } from '@paralleldrive/cuid2'
import JSZip, { type JSZipObjectWithData } from 'jszip'
import * as React from 'react'
import { useFormStatus } from 'react-dom'

import type { UserWithStamps } from '@/lib/prisma/models'

import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalTitle,
  Text,
} from '@/components/ui'

import type { Asset } from './useUpload'

import { FileUpload } from './FileUpload'
import { ImageUpload } from './ImageUpload'
import { StampInfoFieldGroup } from './StampInfoFieldGroup'
import { uploadAsset } from './uploadAsset'

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
  status:
    | 'errorAction'
    | 'errorAWS'
    | 'idle'
    | 'invalidImages'
    | 'invalidZip'
    | 'success'
    | 'upload'
}

const StampFormContext = React.createContext<null | StampFormContextValue>(null)

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
      className="ml-auto font-normal"
      color="secondary"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Loading...' : children}
    </Button>
  )
}

type HeaderProps = {
  subTitle: string
  title: string
}
const Header = ({ subTitle, title }: HeaderProps) => {
  return (
    <div>
      <Heading>{title}</Heading>
      <Text>{subTitle}</Text>
    </div>
  )
}

const isAsset = (b: Asset | Image | JSZipObjectWithData): b is Asset => {
  return (b as Asset).rawFile !== undefined
}

const UploadModal = () => {
  const { status } = useStampFormContext()

  const statusMessage = (() => {
    switch (status) {
      case 'errorAction':
        return {
          isOpen: true,
          message: 'An error occurred while creating the stamp.',
          title: 'Action Error',
        }
      case 'errorAWS':
        return {
          isOpen: true,
          message: 'An error occurred while uploading to AWS.',
          title: 'AWS Error',
        }
      case 'upload':
        return {
          isOpen: true,
          message: 'You will be redirected if stamp creation is successful.',
          title: 'Creating Stamp...',
        }
      default:
        return {
          isOpen: false,
          message: 'The status provided is not recognized.',
          title: 'Unknown Status',
        }
    }
  })()

  return (
    <Modal
      data-testid="upload-modal"
      onClose={() => {}}
      open={statusMessage.isOpen}
    >
      <ModalTitle>{statusMessage.title}</ModalTitle>
      <ModalBody className="space-y-2">
        <Text>{statusMessage.message}</Text>
      </ModalBody>
    </Modal>
  )
}

const Form = ({
  action,
  children,
}: React.PropsWithChildren<{
  action: (formData: FormData) => Promise<{ message: string; ok: boolean }>
}>) => {
  const { files, images, setStatus, stamp } = useStampFormContext()

  const handleOnSubmit = async (formData: FormData) => {
    if (images.length === 0) {
      setStatus('invalidImages')
      return
    }
    if (files.length === 0) {
      setStatus('invalidZip')
      return
    }

    formData.delete('images')
    formData.delete('stamps')
    const stampId = stamp?.id ?? createId()
    formData.set('stampId', stampId)

    const imagesToUpload: Asset[] = []
    const imageIdsToRemove: Set<Image['id']> = stamp?.images
      ? new Set(stamp.images.map((image) => image.id))
      : new Set([])

    for (const image of images) {
      if (isAsset(image)) {
        imagesToUpload.push(image)
        continue
      }
      if (imageIdsToRemove.has(image.id)) {
        imageIdsToRemove.delete(image.id)
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

    try {
      const [uploadedImageUrls, uploadedStampZipUrl] = await Promise.all([
        Promise.all(
          imagesToUpload.map(async (image) => {
            const imagePath = await uploadAsset(
              stampId,
              image.rawFile,
              image.rawFile.type,
              image.name,
            )
            return imagePath
          }),
        ),
        uploadAsset(stampId, zipped, 'zip', formData.get('title') as string),
      ])

      formData.set('stampFileUrl', uploadedStampZipUrl)
      formData.set('uploadedImageUrls', JSON.stringify(uploadedImageUrls))
    } catch (e) {
      setStatus('errorAWS')
      return
    }
    formData.set('imageIdsToRemove', JSON.stringify([...imageIdsToRemove]))

    const error = await action(formData)

    if (error) {
      setStatus('errorAction')
    }
  }

  return (
    <form
      action={(formData) => {
        setStatus('upload')
        handleOnSubmit(formData)
      }}
      className="mt-8 flex flex-col space-y-8"
      data-testid="stamp-form"
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
    stamp?.images ?? [],
  )

  const [files, setFiles] = React.useState<StampFormContextValue['files']>(
    zipFiles ?? [],
  )

  const context = React.useMemo(
    () => ({
      files,
      images,
      setFiles,
      setImages,
      setStatus,
      stamp,
      status,
    }),
    [status, setStatus, files, setFiles, images, setImages, stamp],
  )

  return (
    <StampFormContext.Provider value={context}>
      {children}
      <UploadModal />
    </StampFormContext.Provider>
  )
}

const StampForm = {
  FileUpload,
  Form,
  Header,
  ImageUpload,
  Root,
  StampInfoFieldGroup,
  Submit,
}

export { StampForm, useStampFormContext }
