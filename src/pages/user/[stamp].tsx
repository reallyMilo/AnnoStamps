import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import JSZip from 'jszip'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'

import { StampForm } from '@/components/Form/StampForm'
import Container from '@/components/ui/Container'
import { useUserStamps } from '@/lib/hooks/useUserStamps'
import type { UserWithStamps } from '@/lib/prisma/queries'

type Stamp = UserWithStamps['listedStamps'][0]

const EditStampPage = () => {
  const { query } = useRouter()

  const { session, userStamps, isLoading, error } = useUserStamps()

  const stamp = useMemo<Stamp | undefined>(() => {
    if (!userStamps) {
      return undefined
    }
    return userStamps.listedStamps.find((stamp) => stamp.id === query.stamp)
  }, [userStamps, query.stamp])

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

    formData.set('id', stamp.id)
    const res = await fetch(`/api/stamp/update`, {
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
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <p>{error.info.message}</p>
      </Container>
    )
  }
  if (isLoading || isStampLoading) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </Container>
    )
  }

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
                href="/user/account"
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
            <StampForm.Images />
            <StampForm.Files />
            <StampForm.Fields />
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
