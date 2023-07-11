import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Layout from '@/components/Layout/Layout'
import ListingForm from '@/components/ListingForm'

const Create = () => {
  const router = useRouter()
  useSession({
    required: true,
    onUnauthenticated() {
      //TODO: open modal
      router.replace('/')
    },
  })

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="text-xl font-medium text-gray-800">Upload a stamp</h1>
        <p className="text-gray-500">
          Fill out the form below to upload your stamp.
        </p>
        <p className="mt-6 text-gray-500">
          Join the discord to get notified when new Stamps are uploaded! (coming
          soon)
        </p>

        <ListingForm />
      </div>
    </Layout>
  )
}

export default Create
