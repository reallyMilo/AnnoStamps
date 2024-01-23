import { StampForm } from '@/components/Form/StampForm'
import Container from '@/components/ui/Container'

const CreateStampPage = () => {
  const handleOnSubmit = async (formData: FormData, addImages: string[]) => {
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
          <StampForm.Submit>Submit Stamp</StampForm.Submit>
        </StampForm.Form>
      </StampForm.Root>
    </Container>
  )
}

export default CreateStampPage
