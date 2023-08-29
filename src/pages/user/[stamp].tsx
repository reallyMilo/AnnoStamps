import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'

import EditForm from '@/components/EditForm'
import Layout from '@/components/Layout/Layout'

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context)

  const { stamp, author } = context.query

  if (session?.user.id !== author)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  return {
    props: {
      stamp,
    },
  }
}

const Edit = ({ stamp }: { stamp: string }) => {
  return (
    <Layout>
      <div className="mx-auto max-w-screen-sm px-5 py-12">
        <h1 className="text-xl font-medium text-gray-800">Edit your stamp</h1>
        <p className="text-gray-500">
          Fill out the form below to update your stamp.
        </p>
        <div className="mt-8">
          <EditForm stampId={stamp} />
        </div>
      </div>
    </Layout>
  )
}

export default Edit
