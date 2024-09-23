'use client'

import { usePathname } from 'next/navigation'

import { addCommentToStamp } from './actions'
import { AddCommentForm } from './AddCommentForm'

export const AddCommentToStamp = () => {
  const pathname = usePathname()
  const addCommentToStampAction = addCommentToStamp.bind(
    null,
    pathname.split('/').at(-1) as string,
    null,
  )
  return (
    <AddCommentForm.Root>
      <AddCommentForm.Form action={addCommentToStampAction}>
        <AddCommentForm.FormActionButtons>
          Comment
        </AddCommentForm.FormActionButtons>
      </AddCommentForm.Form>
    </AddCommentForm.Root>
  )
}
