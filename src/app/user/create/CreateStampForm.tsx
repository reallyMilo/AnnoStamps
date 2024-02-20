'use client'
import { StampForm } from '@/components/Form/StampForm'

import { createStamp } from '../actions'

const CreateStampForm = () => {
  return (
    <StampForm.Root>
      <StampForm.Form action={createStamp}>
        <StampForm.Header
          title="Upload stamp"
          subTitle="Fill out the form below to upload your stamp."
        />
        <StampForm.Images />
        <StampForm.Files />
        <StampForm.Fields />
        <StampForm.Submit>Submit Stamp</StampForm.Submit>
      </StampForm.Form>
    </StampForm.Root>
  )
}

export default CreateStampForm
