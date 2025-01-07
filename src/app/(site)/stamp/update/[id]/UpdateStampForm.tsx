'use client'

import JSZip, { type JSZipObjectWithData } from 'jszip'
import useSWR from 'swr'

import type { StampWithRelations } from '@/lib/prisma/models'

import { StampForm } from '@/components/StampForm/StampForm'
import { Heading } from '@/components/ui'

import { updateStamp } from './actions'

export const UpdateStampForm = ({ stamp }: { stamp: StampWithRelations }) => {
  const {
    data: stampZip,
    error,
    isLoading: isStampLoading,
  } = useSWR(stamp.stampFileUrl, async (url: string) => {
    const res = await fetch(url)
    const blob = await res.blob()
    const zip = await JSZip.loadAsync(blob)
    return zip
  })

  if (error) {
    return <Heading>Failed to get zip file.</Heading>
  }
  if (isStampLoading) {
    return (
      <>
        <Heading className="text-xl font-bold text-gray-800">
          Fetching Stamp
        </Heading>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </>
    )
  }

  if (!stampZip) {
    return <Heading>Cannot unzip zip folder</Heading>
  }
  return (
    <StampForm.Root
      stamp={stamp}
      zipFiles={Object.values(stampZip.files) as JSZipObjectWithData[]}
    >
      <StampForm.Form action={updateStamp}>
        <StampForm.Header
          subTitle="Fill out the form below to update your stamp."
          title="Edit your stamp"
        />
        <StampForm.ImageUpload />
        <StampForm.FileUpload />
        <StampForm.StampInfoFieldGroup />
        <StampForm.Submit> Update Stamp </StampForm.Submit>
      </StampForm.Form>
    </StampForm.Root>
  )
}
