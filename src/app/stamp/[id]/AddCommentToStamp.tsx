'use client'

import type { StampWithRelations } from '@/lib/prisma/models'

import { AddCommentForm } from './AddCommentForm'

export const AddCommentToStamp = ({ id }: Pick<StampWithRelations, 'id'>) => {
  return (
    <AddCommentForm.Root>
      <AddCommentForm.Form id={id}>
        <AddCommentForm.FormActionButtons>
          Comment
        </AddCommentForm.FormActionButtons>
      </AddCommentForm.Form>
    </AddCommentForm.Root>
  )
}
