'use client'
import { StampForm } from '@/components/StampForm/StampForm'
import { Button, Heading, Text } from '@/components/ui'
import { ALLOW_117_STAMP_WRITES } from '@/lib/constants/featureFlags'

import { createStamp } from './actions'

export const CreateStampForm = () => {
  if (!ALLOW_117_STAMP_WRITES) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-700/60 dark:bg-amber-950/20">
        <Heading className="text-lg">Anno 117 uploads are coming soon</Heading>
        <Text>
          Uploads are currently enabled only for Anno 1800. Use the top version
          switcher or continue directly to the 1800 upload page.
        </Text>
        <Button color="secondary" href="/1800/stamp/create">
          Open 1800 Upload
        </Button>
      </div>
    )
  }

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
