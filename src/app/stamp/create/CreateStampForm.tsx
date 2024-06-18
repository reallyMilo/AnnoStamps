'use client'
import { StampForm } from '@/components/StampForm/StampForm'

import { createStamp } from './actions'

export const CreateStampForm = () => {
  return (
    <StampForm.Root>
      <StampForm.Form action={createStamp}>
        <StampForm.Header
          title="Upload stamp"
          subTitle="Fill out the form below to upload your stamp."
        />
        <StampForm.ImageUpload />
        <StampForm.FileUpload />
        <StampForm.StampInfoFieldGroup />
        <StampForm.Submit>Submit Stamp</StampForm.Submit>
      </StampForm.Form>
    </StampForm.Root>
  )
}
