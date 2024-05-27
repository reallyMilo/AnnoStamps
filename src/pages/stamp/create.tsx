import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { StampForm } from '@/components/StampForm/StampForm'
import { Container } from '@/components/ui'

const CreateStampPage = () => {
  const router = useRouter()
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
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

  //TODO: Page Wrapper that checks auth + set username for all routes that require auth and username set
  if (!session.data?.user.username) {
    return (
      <Container>
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              This account currently does not have a username set.{' '}
              <Link
                href={`/${session.data?.user.id}/settings`}
                className="font-medium text-yellow-700 underline hover:text-yellow-600"
              >
                Please set your username.
              </Link>
            </p>
          </div>
        </div>
      </Container>
    )
  }
  return (
    <Container className="md:max-w-5xl">
      <StampForm.Root>
        <StampForm.Form onSubmit={handleOnSubmit}>
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
    </Container>
  )
}

export default CreateStampPage
