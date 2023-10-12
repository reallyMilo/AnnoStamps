import { JSZipObject } from 'jszip'
import * as React from 'react'

import { UserWithStamps } from '@/lib/prisma/queries'
import { Asset } from '@/lib/utils'

import Fields from './Fields'
import Files from './Files'
import Images from './Images'

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
  status: 'idle' | 'loading' | 'error' | 'success'
}

const StampFormContext = React.createContext<StampFormContextValue | null>(null)

const useStampFormContext = () => {
  const context = React.useContext(StampFormContext)
  if (!context) {
    throw new Error('needs to be used within StampForm Provider')
  }
  return context
}

const Submit = () => {
  const { status } = useStampFormContext()
  const isMutating = status === 'loading'
  return (
    <button
      type="submit"
      className="ml-auto rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
      disabled={isMutating}
    >
      {isMutating ? 'Loading...' : 'Submit Stamp'}
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
    images: StampFormContextValue['images'],
    files: StampFormContextValue['files'],
    formData: FormData
  ) => Promise<Response>
}
const Form = ({ children, onSubmit }: FormProps) => {
  const { images, files, setStatus } = useStampFormContext()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)

    const res = await onSubmit(images, files, formData)
    if (res.ok) {
      setStatus('success')
      return
    }
    setStatus('error')
  }

  //TODO: noValidate handle form validation
  return (
    <form className="mt-8 space-y-8" onSubmit={handleOnSubmit} noValidate>
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
