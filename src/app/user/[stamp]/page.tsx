import { redirect } from 'next/navigation'
import { cache } from 'react'

import { auth } from '@/auth'
import Container from '@/components/ui/Container'
import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

import UpdateStampForm from './UpdateStampForm'

const getUserWithStamps = cache(async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    include: userIncludeStatement,
    where: {
      id,
    },
  })
})

const EditStampPage = async ({ params }: { params: { stamp: string } }) => {
  const session = await auth()
  if (!session) {
    redirect('/auth/signin')
  }

  const user = await getUserWithStamps(session.user.id)
  const stamp = user.listedStamps.find((stamp) => stamp.id === params.stamp)

  if (!stamp) {
    return (
      <Container>
        <p>Not stamp owner</p>
      </Container>
    )
  }

  return (
    <Container className="md:max-w-5xl">
      <UpdateStampForm stamp={stamp} />
    </Container>
  )
}

export default EditStampPage
