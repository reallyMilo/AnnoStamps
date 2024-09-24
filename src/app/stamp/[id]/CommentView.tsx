'use client'

import { usePathname } from 'next/navigation'

import type { Comment } from '@/lib/prisma/models'

import { addCommentToStamp } from './actions'
import { AddCommentForm } from './AddCommentForm'

export const CommentView = ({ parentId }: { parentId?: Comment['id'] }) => {
  const pathname = usePathname()
  const addCommentAction = addCommentToStamp.bind(
    null,
    pathname.split('/').at(-1) as string,
    parentId ? parentId : null,
  )

  if (parentId) {
    return (
      <AddCommentForm.Root isVisible={false}>
        <AddCommentForm.ShowFormButton>
          <AddCommentForm.Form action={addCommentAction}>
            <AddCommentForm.FormActionButtons>
              Reply
            </AddCommentForm.FormActionButtons>
          </AddCommentForm.Form>
        </AddCommentForm.ShowFormButton>
      </AddCommentForm.Root>
    )
  }
  return (
    <AddCommentForm.Root>
      <AddCommentForm.Form action={addCommentAction}>
        <AddCommentForm.FormActionButtons>
          Comment
        </AddCommentForm.FormActionButtons>
      </AddCommentForm.Form>
    </AddCommentForm.Root>
  )
}
