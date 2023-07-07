import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

import { sendRequest } from '@/lib/utils'

import Description from './Form/Description'
import FileUpload from './Form/FileUpload'
import ImageUpload from './Form/ImageUpload'

const ListingForm = () => {
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation('/api/add-stamp', sendRequest)

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    // if (!image && !stamp) {
    //   alert('Screenshot and Stamp file are required')
    //   return
    // }

    const targetField = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      region: formData.get('region'),
      good: formData.get('good') ?? 'none',
      capital: formData.get('capital') ?? 'none',
      townhall: formData.get('townhall') === 'true',
      tradeUnion: formData.get('tradeUnion') === 'true',
      modded: formData.get('modded') === 'true',
      image: formData.get('image'),
      stamp: formData.get('stamp'),
    }
    console.log(targetField)
    // try {
    //   const response = await trigger(targetField)
    //   toast.success(response.message)
    //   router.push('/user/stamps')
    // } catch (e) {
    //   let message
    //   if (e instanceof Error) message = e.message
    //   else message = String(e)

    //   toast.error(message)
    // }
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-8 space-y-8">
      <div className="mb-10 grid grid-cols-2 gap-10">
        <ImageUpload />
        <FileUpload />
      </div>
      <Description isMutating={isMutating} />
    </form>
  )
}

export default ListingForm
