import { createId } from '@paralleldrive/cuid2'
import JSZip from 'jszip'
import { useSession } from 'next-auth/react'

import type { StampFormContextValue } from '@/components/Form/StampForm'
import { StampForm } from '@/components/Form/StampForm'
import Container from '@/components/ui/Container'
import { upload } from '@/lib/upload'
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
    const stampId = createId()
    formData.set('stampId', stampId)
    formData.delete('images')
    formData.delete('stamps')

    const zip = new JSZip()
    for (const file of files as Asset[]) {
      zip.file(file.name, file.rawFile)
    }
    const zipped = await zip.generateAsync({ type: 'blob' })

    const zipPath = await upload(stampId, zipped, 'zip')

    formData.set('stampFileUrl', zipPath ?? '')
    formData.set('collection', files.length > 1 ? 'true' : 'false')

    const addImages = []
    for (const image of images as Asset[]) {
      const imagePath = await upload(
        stampId,
        image.rawFile,
        image.mime,
        image.name
      )
      addImages.push({ originalUrl: imagePath })
    }

    const res = await fetch('/api/stamp/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...Object.fromEntries(formData),
        addImages,
      }),
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
