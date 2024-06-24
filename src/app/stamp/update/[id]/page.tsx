import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Container, Text } from '@/components/ui'
import { userIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'

import { UpdateStampForm } from './UpdateStampForm'

const EditStampPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
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
            <Text className="text-sm text-yellow-700">
              This account currently does not have a username set.{' '}
              <Link
                href={`/${session?.user.id}/settings`}
                className="font-medium text-yellow-700 underline hover:text-yellow-600"
              >
                Please set your username.
              </Link>
            </Text>
          </div>
        </div>
      </Container>
    )
  }

  const userStamp = await prisma.user.findUnique({
    include: userIncludeStatement,
    where: {
      id: session.user.id,
      listedStamps: {
        some: {
          id: {
            equals: params.id,
          },
        },
      },
    },
  })
  if (!userStamp) {
    throw new Error('Not your stamp')
  }

  return (
    <Container className="md:max-w-5xl">
      <UpdateStampForm stamp={userStamp.listedStamps[0]} />
    </Container>
  )
}

export default EditStampPage
