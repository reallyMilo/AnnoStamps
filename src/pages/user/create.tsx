import { useSession } from 'next-auth/react'

import { StampForm } from '@/components/Form/StampForm'
import Container from '@/components/ui/Container'
import { displayAuthModal } from '@/lib/utils'

const CreateStampPage = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  if (status === 'loading')
    return (
      <Container>
        <p> login please</p>
      </Container>
    )

  return (
    <Container className="md:max-w-5xl">
      <StampForm.Root>
        <StampForm.Header
          title="Upload stamp"
          subTitle="Fill out the form below to upload your stamp."
        />
        <StampForm.Images />
        <StampForm.File />
        <StampForm.Fields />
        <StampForm.Submit />
      </StampForm.Root>
    </Container>
  )
}

export default CreateStampPage
