import axios from 'axios'
import { getSession } from 'next-auth/react'

import Layout from '@/components/Layout'
import ListingForm from '@/components/ListingForm'
import { prisma } from '@/lib/prisma'

export async function getServerSideProps(context) {
  const session = await getSession(context)

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }

  // Check if the user is authenticated
  if (!session) {
    return redirect
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedStamps: true },
  })

  // Check if authenticated user is the owner of this stamp
  const id = context.params.id
  const stamp = user?.listedStamps?.find((stamp) => stamp.id === id)
  if (!stamp) {
    return redirect
  }

  return {
    props: JSON.parse(JSON.stringify(stamp)),
  }
}

const Edit = (stamp = null) => {
  const handleOnSubmit = (data) => axios.patch(`/api/stamp/${stamp.id}`, data)

  return (
    <Layout>
      <div className="mx-auto max-w-screen-sm px-5 py-12">
        <h1 className="text-xl font-medium text-gray-800">Edit your stamp</h1>
        <p className="text-gray-500">
          Fill out the form below to update your stamp.
        </p>
        <div className="mt-8">
          {stamp ? (
            <ListingForm
              initialValues={stamp}
              buttonText="Update stamp"
              redirectPath={`/stamps/${stamp.id}`}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  )
}

export default Edit
