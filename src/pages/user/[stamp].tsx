import { useRouter } from 'next/router'
import { useMemo } from 'react'

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

  if (error) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <p>{error.info.message}</p>
      </Container>
    )
  }
  if (isLoading) {
    return (
      <Container>
        <h1 className="text-xl font-bold text-gray-800">Your Stamps</h1>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </Container>
    )
  }

  return (
    <Container className="md:max-w-5xl">
      {stamp ? (
        <StampForm.Root stamp={stamp} action="update">
          <StampForm.Header
            title="Edit your stamp"
            subTitle="Fill out the form below to update your stamp."
          />
          <StampForm.Images />
          <StampForm.File />
          <StampForm.Fields />
          <StampForm.Submit />
        </StampForm.Root>
      ) : (
        <p> not your stamp </p>
      )}
    </Container>
  )
}

export default EditStampPage
