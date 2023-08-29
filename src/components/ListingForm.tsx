import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

import { sendRequest } from '@/lib/utils'

import Fields from './Form/Fields'
import FileUpload from './Form/FileUpload'
import ImageUpload from './Form/ImageUpload'

const ListingForm = () => {
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation('/api/stamp/add', sendRequest)

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const targetField = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      region: formData.get('region'),
      good: formData.get('good') ?? 'none',
      capital: formData.get('capital') ?? 'none',
      townhall: formData.get('townhall') === 'true',
      tradeUnion: formData.get('trade-union') === 'true',
      modded: formData.get('modded') === 'true',
      image: formData.get('imgSrc'),
      stamp: formData.get('fileSrc'),
    }

    try {
      const response = await trigger(targetField)
      toast.success(response.message)
      router.push('/user/stamps')
    } catch (e) {
      let message
      if (e instanceof Error) message = e.message
      else message = String(e)

      toast.error(message)
    }
  }

  return (
    <form id="form" onSubmit={handleOnSubmit} className="mt-8 space-y-8">
      <div className="mb-10 grid grid-cols-2 gap-10">
        <ImageUpload />
        <FileUpload />
      </div>
      <Fields />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isMutating}
          className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
          data-testid="add-stamp-button"
        >
          {isMutating ? 'Loading...' : 'Add Stamp'}
        </button>
      </div>
    </form>
  )
}

export default ListingForm
