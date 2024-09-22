'use client'

import type { StampWithRelations } from '@/lib/prisma/models'

import { addCommentToStamp } from './actions'
import { AddCommentForm } from './AddCommentForm'

export const AddCommentToStamp = ({ id }: Pick<StampWithRelations, 'id'>) => {
  const addCommentToStampAction = addCommentToStamp.bind(null, id, null)
  return (
    <AddCommentForm.Root>
      <AddCommentForm.Form action={addCommentToStampAction} stampId={id}>
        <AddCommentForm.FormActionButtons>
          Comment
        </AddCommentForm.FormActionButtons>
      </AddCommentForm.Form>
    </AddCommentForm.Root>
  )
}
