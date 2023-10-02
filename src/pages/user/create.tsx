import JSZip from 'jszip'
import { useSession } from 'next-auth/react'

import type { StampFormContextValue } from '@/components/Form/StampForm'
import { StampForm } from '@/components/Form/StampForm'
import Container from '@/components/ui/Container'
import { Asset, displayAuthModal } from '@/lib/utils'
const CreateStampPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  const handleOnSubmit = async (
    images: StampFormContextValue['images'],
    files: StampFormContextValue['files'],
    formData: FormData
  ) => {
    const zip = new JSZip()
    for (const file of files as Asset[]) {
      zip.file(file.name, file.rawFile)
    }
    formData.set('stamps', await zip.generateAsync({ type: 'blob' }))

    formData.delete('images')
    for (const image of images as Asset[]) {
      formData.append('images', image.rawFile)
      // on local we send in request body
      // staging + prod get presignedURl and upload directly
    }

    const res = await fetch('/api/stamp/create', {
      method: 'POST',
      body: formData,
    })

    return res
  }

  if (status === 'loading')
    return (
      <Container>
        <p> login please</p>
      </Container>
    )

  return (
    <Container className="md:max-w-5xl">
      <StampForm.Root>
        <StampForm.Form onSubmit={handleOnSubmit}>
          <StampForm.Header
            title="Upload stamp"
            subTitle="Fill out the form below to upload your stamp."
          />
          <StampForm.Images />
          <StampForm.Files />
          <StampForm.Fields />
          <StampForm.Submit />
        </StampForm.Form>
      </StampForm.Root>
    </Container>
  )
}

export default CreateStampPage
