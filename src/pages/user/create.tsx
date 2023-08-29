import { useSession } from 'next-auth/react'

import ListingForm from '@/components/ListingForm'
import { displayAuthModal } from '@/lib/utils'

const Create = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  if (status === 'loading')
    return (
      <div className="mx-auto max-w-5xl px-5 py-12">
        <p> login please</p>
      </div>
    )

  return (
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
  )
}

export default Create
