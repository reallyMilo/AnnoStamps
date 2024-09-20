'use client'
import type { Comment } from '@/lib/prisma/models'

import { AddCommentForm } from './AddCommentForm'

export const AddReplyToComment = ({ id }: Pick<Comment, 'id'>) => {
  return (
    <AddCommentForm.Root isVisible={false}>
      <AddCommentForm.ShowFormButton>
        <AddCommentForm.Form id={id}>
          <AddCommentForm.FormActionButtons>
            Reply
          </AddCommentForm.FormActionButtons>
        </AddCommentForm.Form>
      </AddCommentForm.ShowFormButton>
    </AddCommentForm.Root>
  )
}
