'use client'

import { usePathname } from 'next/navigation'

import type { Comment } from '@/lib/prisma/models'

import { addCommentToStamp } from './actions'
import { CommentForm } from './CommentForm'

type CommentViewProps = Partial<Pick<Comment, 'parentId'>> & {
  userIdToNotify: Comment['user']['id']
}

export const CommentView = ({ parentId, userIdToNotify }: CommentViewProps) => {
  const pathname = usePathname()

  const addCommentAction = addCommentToStamp.bind(
    null,
    pathname.split('/').at(-1) as string,
    parentId ? parentId : null,
    userIdToNotify,
  )

  if (parentId) {
    return (
      <CommentForm.Root isVisible={false}>
        <CommentForm.ShowFormButton>
          <CommentForm.Form action={addCommentAction}>
            <CommentForm.FormActionButtons>Reply</CommentForm.FormActionButtons>
          </CommentForm.Form>
        </CommentForm.ShowFormButton>
      </CommentForm.Root>
    )
  }
  return (
    <CommentForm.Root>
      <CommentForm.Form action={addCommentAction}>
        <CommentForm.FormActionButtons>Comment</CommentForm.FormActionButtons>
      </CommentForm.Form>
    </CommentForm.Root>
  )
}
