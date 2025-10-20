import type { Metadata } from 'next'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getSession } from '@/auth'
import { Container, Text } from '@/components/ui'
import { stampIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'

import { UpdateStampForm } from './UpdateStampForm'

export const generateMetadata = async (props: {
  params: Promise<{ id: string }>
}): Promise<Metadata> => {
  const params = await props.params
  return {
    title: `Update:${params.id} | AnnoStamps`,
  }
}
const EditStampPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  if (!session.user.username) {
    return (
      <Container>
        <div className="flex">
          <div className="shrink-0">
            <ExclamationTriangleIcon
              aria-hidden="true"
              className="h-5 w-5 text-yellow-400"
            />
          </div>
          <div className="ml-3">
            <Text className="text-sm text-yellow-700">
              This account currently does not have a username set.{' '}
              <Link
                className="font-medium text-yellow-700 underline hover:text-yellow-600"
                href={`/${session.userId}/settings`}
              >
                Please set your username.
              </Link>
            </Text>
          </div>
        </div>
      </Container>
    )
  }

  const userStamp = await prisma.stamp.findUnique({
    include: stampIncludeStatement,
    where: {
      id: params.id,
      userId: session.userId,
    },
  })

  if (!userStamp) {
    throw new Error('Not your stamp')
  }

  return (
    <Container className="md:max-w-5xl">
      <UpdateStampForm stamp={userStamp} />
    </Container>
  )
}

export default EditStampPage
