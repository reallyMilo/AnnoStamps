import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

import Fields from '@/components/Form/Fields'
import FileUpload from '@/components/Form/FileUpload'
import ImageUpload from '@/components/Form/ImageUpload'
import Container from '@/components/ui/Container'
import { displayAuthModal, sendRequest } from '@/lib/utils'

const Create = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  const router = useRouter()
  const { trigger, isMutating } = useSWRMutation('/api/stamp/add', sendRequest)

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    try {
      const res = await trigger(formData)
      toast.success(res.message)
      router.push('/user/stamps')
    } catch (e) {
      toast.error(String(e))
    }
  }

  if (status === 'loading')
    return (
      <Container>
        <p> login please</p>
      </Container>
    )

  return (
    <Container className="md:max-w-5xl">
      <h1 className="text-xl font-medium text-gray-800">Upload a stamp</h1>
      <p className="text-gray-500">
        Fill out the form below to upload your stamp.
      </p>
      <p className="mt-6 text-gray-500">
        Join the discord to get notified when new Stamps are uploaded! (coming
        soon)
      </p>
      <form
        id="form"
        onSubmit={handleOnSubmit}
        className="mt-8 space-y-8"
        encType="multipart/form-data"
      >
        <ImageUpload />
        <FileUpload />

        <Fields />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
            disabled={isMutating}
            data-testid="add-stamp-button"
          >
            {isMutating ? 'Loading...' : 'Add Stamp'}
          </button>
        </div>
      </form>
    </Container>
  )
}

export default Create
