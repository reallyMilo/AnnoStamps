import JSZip, { JSZipObject } from 'jszip'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'

import type { StampFormContextValue } from '@/components/Form/StampForm'
import { StampForm } from '@/components/Form/StampForm'
import Container from '@/components/ui/Container'
import { useUserStamps } from '@/lib/hooks/useUserStamps'
import type { UserWithStamps } from '@/lib/prisma/queries'
import type { Image } from '@/lib/prisma/queries'
import { Asset } from '@/lib/utils'

type Stamp = UserWithStamps['listedStamps'][0]

const isAsset = (b: Asset | JSZipObject | Image): b is Asset => {
  return (b as Asset).rawFile !== undefined
}

const EditStampPage = () => {
  const { query } = useRouter()

  const { userStamps, isLoading, error } = useUserStamps()

  const stamp = useMemo<Stamp | undefined>(() => {
    if (!userStamps) {
      return undefined
    }
    return userStamps.listedStamps.find((stamp) => stamp.id === query.stamp)
  }, [userStamps, query.stamp])

  const { data: stampZip, isLoading: isStampLoading } = useSWR(
    stamp ? stamp.stampFileUrl : null,
    async (url: string) => {
      const res = await fetch(url)
      const blob = await res.blob()
      const zip = await JSZip.loadAsync(blob)
      return zip
    }
  )
  const handleOnSubmit = async (
    images: StampFormContextValue['images'],
    files: StampFormContextValue['files'],
    formData: FormData
  ) => {
    formData.delete('images')

    for (const image of images) {
      if (isAsset(image)) {
        formData.append('images', image.rawFile)
        // on local we send in request body
        // staging + prod we presignedURl and upload directly
        continue
      }
      formData.append('keepImages', image.id)
    }

    const newZip = new JSZip()
    for (const file of files) {
      if (isAsset(file)) {
        newZip.file(file.name, file.rawFile)
        continue
      }
      newZip.file(file.name, file.async('blob'))
    }
    formData.set('stamps', await newZip.generateAsync({ type: 'blob' }))
    formData.set('collection', files.length > 1 ? 'true' : 'false')

    const res = await fetch(`/api/stamp/${stamp?.id}`, {
      method: 'PUT',
      body: formData,
    })

    return res
  }
  if (error) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <p>{error.info.message}</p>
      </Container>
    )
  }
  if (isLoading || isStampLoading) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </Container>
    )
  }

  return (
    <Container className="md:max-w-5xl">
      {stamp && stampZip ? (
        <StampForm.Root stamp={stamp} zipFiles={Object.values(stampZip.files)}>
          <StampForm.Form onSubmit={handleOnSubmit}>
            <StampForm.Header
              title="Edit your stamp"
              subTitle="Fill out the form below to update your stamp."
            />
            <StampForm.Images />
            <StampForm.Files />
            <StampForm.Fields />
            <StampForm.Submit />
          </StampForm.Form>
        </StampForm.Root>
      ) : (
        <p> not your stamp </p>
      )}
    </Container>
  )
}

export default EditStampPage
