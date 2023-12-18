import JSZip from 'jszip'
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

  const { userStamps, isLoading, error } = useUserStamps()

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

    const res = await fetch(`/api/stamp/${stamp.id}`, {
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
