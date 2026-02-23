'use client'

import JSZip, { type JSZipObjectWithData } from 'jszip'
import { useState } from 'react'
import useSWR from 'swr'

import type { StampWithRelations } from '@/lib/prisma/models'

import { StampForm } from '@/components/StampForm/StampForm'
import { Field, Heading, Label, Select } from '@/components/ui'

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

  const [gameVersion, setGameVersion] = useState<string>(stamp.game)
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
        <Field>
          <Label>Switch Game Version</Label>
          <Select
            defaultValue={gameVersion}
            id="game"
            name="game"
            onChange={(e) => setGameVersion(e.target.value)}
            required
          >
            <option value="117">117</option>
            <option value="1800">1800</option>
          </Select>
        </Field>

        <StampForm.ImageUpload />
        <StampForm.FileUpload />
        <StampForm.StampInfoFieldGroup game={gameVersion} />
        <input name="game" type="hidden" value={gameVersion} />
        <StampForm.Submit> Update Stamp </StampForm.Submit>
      </StampForm.Form>
    </StampForm.Root>
  )
}
