'use client'
import JSZip from 'jszip'
import useSWR from 'swr'

import { StampForm } from '@/components/Form/StampForm'
import type { UserWithStamps } from '@/lib/prisma/queries'

import { updateStamp } from '../actions'

const UpdateStampForm = ({
  stamp,
}: {
  stamp: UserWithStamps['listedStamps'][0]
}) => {
  const {
    data: stampZip,
    isLoading,
    error,
  } = useSWR(stamp.stampFileUrl, async (url: string) => {
    const res = await fetch(url)
    const blob = await res.blob()
    const zip = await JSZip.loadAsync(blob)
    return zip
  })

  if (error) {
    return <pre>{error}</pre>
  }
  if (isLoading) {
    return <p></p>
  }

  if (!stampZip) {
    return <p></p>
  }

  return (
    <StampForm.Root stamp={stamp} zipFiles={Object.values(stampZip.files)}>
      <StampForm.Form action={updateStamp}>
        <StampForm.Header
          title="Edit your stamp"
          subTitle="Fill out the form below to update your stamp."
        />
        <StampForm.Images />
        <StampForm.Files />
        <StampForm.Fields />
        <StampForm.Submit> Update Stamp </StampForm.Submit>
      </StampForm.Form>
    </StampForm.Root>
  )
}

export default UpdateStampForm
