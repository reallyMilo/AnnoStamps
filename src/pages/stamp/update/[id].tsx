import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import JSZip from 'jszip'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import useSWR from 'swr'

import { StampForm } from '@/components/StampForm/StampForm'
import { Container, Heading } from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/queries'

const useUserStamps = () => {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/auth/signin')
    },
  })

  const { data, isLoading, error } = useSWR<{ data: UserWithStamps }>(
    status === 'authenticated' ? '/api/user' : null,
    async (url: string) => {
      const res = await fetch(url)

      if (!res.ok) {
        const error = new Error(
          'An error occurred while fetching the data.'
        ) as Error & { info: string; status: number }
        error.info = await res.json()
        error.status = res.status
        throw error
      }

      return res.json()
    }
  )

  return {
    userStamps: data?.data,
    session,
    isLoading,
    error,
  }
}

type Stamp = UserWithStamps['listedStamps'][0]

const EditStampPage = () => {
  const { query } = useRouter()

  const { session, userStamps, isLoading, error } = useUserStamps()

  const stamp = useMemo<Stamp | undefined>(() => {
    if (!userStamps) {
      return undefined
    }
    return userStamps.listedStamps.find((stamp) => stamp.id === query.id)
  }, [userStamps, query.id])

  const { data: stampZip, isLoading: isStampLoading } = useSWR(
    stamp ? stamp.stampFileUrl : null,
    async (url: string) => {
      const res = await fetch(url)
      const blob = await res.blob()
      const zip = await JSZip.loadAsync(blob)
      return zip
    }
  )
  const handleOnSubmit = async (
    formData: FormData,
    addImages: string[],
    imagesToRemove?: string[]
  ) => {
    if (!stamp) {
      throw new Error('no stamp')
    }

    const res = await fetch(`/api/stamp/update/${stamp.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...Object.fromEntries(formData),
        addImages,
        deleteImages: imagesToRemove ?? [],
      }),
    })

    return res
  }
  if (error) {
    return (
      <Container>
        <Heading>Error</Heading>
        <p>{error.info.message}</p>
      </Container>
    )
  }
  if (isLoading || isStampLoading) {
    return (
      <Container>
        <Heading className="text-xl font-bold text-gray-800">
          Fetching Stamp
        </Heading>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </Container>
    )
  }
  //TODO: Page Wrapper that checks auth + set username for all routes that require auth and username set

  if (!session?.user.username) {
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
                href={`/${session?.user.id}/settings`}
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
      {stamp && stampZip ? (
        <StampForm.Root stamp={stamp} zipFiles={Object.values(stampZip.files)}>
          <StampForm.Form onSubmit={handleOnSubmit}>
            <StampForm.Header
              title="Edit your stamp"
              subTitle="Fill out the form below to update your stamp."
            />
            <StampForm.ImageUpload />
            <StampForm.FileUpload />
            <StampForm.FormInputFields />
            <StampForm.Submit> Update Stamp </StampForm.Submit>
          </StampForm.Form>
        </StampForm.Root>
      ) : (
        <p> not your stamp </p>
      )}
    </Container>
  )
}

export default EditStampPage
