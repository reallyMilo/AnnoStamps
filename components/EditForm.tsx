import { sendRequest } from 'lib/utils'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

import Fields from './Form/Fields'

const EditForm = ({ stampId }: { stampId: string }) => {
  const router = useRouter()
  const { trigger, isMutating } = useSWRMutation(
    `/api/stamp/${stampId}`,
    sendRequest
  )
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
        <p className="prose">
          Not allowed to edit images or stamp files once they have been
          submitted. You can change fields, titles and descriptions only. Can
          always link the new stamp in the description of the original.
        </p>
      </div>
      <Fields />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isMutating}
          className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
        >
          {isMutating ? 'Loading...' : 'Update Stamp'}
        </button>
      </div>
    </form>
  )
}

export default EditForm
