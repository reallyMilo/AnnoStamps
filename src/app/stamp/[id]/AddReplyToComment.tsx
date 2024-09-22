'use client'
import type { Comment, StampWithRelations } from '@/lib/prisma/models'

import { addCommentToStamp } from './actions'
import { AddCommentForm } from './AddCommentForm'

type AddReplyToCommentProps = {
  parentId: Comment['id']
  stampId: StampWithRelations['id']
}
export const AddReplyToComment = ({
  parentId,
  stampId,
}: AddReplyToCommentProps) => {
  const addReplyToCommentAction = addCommentToStamp.bind(
    null,
    stampId,
    parentId,
  )

  return (
    <AddCommentForm.Root isVisible={false}>
      <AddCommentForm.ShowFormButton>
        <AddCommentForm.Form action={addReplyToCommentAction} stampId={stampId}>
          <AddCommentForm.FormActionButtons>
            Reply
          </AddCommentForm.FormActionButtons>
        </AddCommentForm.Form>
      </AddCommentForm.ShowFormButton>
    </AddCommentForm.Root>
  )
}
