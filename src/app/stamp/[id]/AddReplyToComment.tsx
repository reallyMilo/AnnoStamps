'use client'
import { usePathname } from 'next/navigation'

import type { Comment } from '@/lib/prisma/models'

import { addCommentToStamp } from './actions'
import { AddCommentForm } from './AddCommentForm'

export const AddReplyToComment = ({
  parentId,
}: {
  parentId: Comment['id']
}) => {
  const pathname = usePathname()

  const addReplyToCommentAction = addCommentToStamp.bind(
    null,
    pathname.split('/').at(-1) as string,
    parentId,
  )

  return (
    <AddCommentForm.Root isVisible={false}>
      <AddCommentForm.ShowFormButton>
        <AddCommentForm.Form action={addReplyToCommentAction}>
          <AddCommentForm.FormActionButtons>
            Reply
          </AddCommentForm.FormActionButtons>
        </AddCommentForm.Form>
      </AddCommentForm.ShowFormButton>
    </AddCommentForm.Root>
  )
}
