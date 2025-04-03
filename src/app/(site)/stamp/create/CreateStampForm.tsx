'use client'
import { StampForm } from '@/components/StampForm/StampForm'

import { createStamp } from './actions'

export const CreateStampForm = () => {
  return (
    <StampForm.Root>
      <StampForm.Form action={createStamp}>
        <StampForm.Header
          subTitle="Fill out the form below to upload your stamp."
          title="Upload 117 Stamp"
        />
        <StampForm.ImageUpload />
        <StampForm.FileUpload />
        <StampForm.StampInfoFieldGroup game="117" />
        <input name="game" type="hidden" value="117" />
        <StampForm.Submit>Submit Stamp</StampForm.Submit>
      </StampForm.Form>
    </StampForm.Root>
  )
}
