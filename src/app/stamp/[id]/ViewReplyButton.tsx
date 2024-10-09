'use client'

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { Suspense, use, useState } from 'react'

import type { Comment } from '@/lib/prisma/models'

import { Button } from '@/components/ui'

import { CommentItem } from './CommentItem'
type ViewReplyButtonProps = {
  numReplies: number
  replyThreadPromise: Promise<Omit<Comment, '_count'>[]>
}

const ReplyThread = ({
  replyThreadPromise,
}: Pick<ViewReplyButtonProps, 'replyThreadPromise'>) => {
  const replyThreadContent = use(replyThreadPromise)
  return (
    <ul className="pt-2" data-testid="reply-list">
      {replyThreadContent.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </ul>
  )
}
export const ViewReplyButton = ({
  numReplies,
  replyThreadPromise,
}: ViewReplyButtonProps) => {
  const [isOpenReplies, setIsOpenReplies] = useState(false)

  if (numReplies === 0) return null

  const replyText = numReplies > 1 ? 'Replies' : 'Reply'

  if (!isOpenReplies) {
    return (
      <Button
        className="text-xs sm:text-xs"
        onClick={() => setIsOpenReplies(true)}
        outline
      >
        <ArrowDownIcon /> {numReplies} {replyText}
      </Button>
    )
  }

  return (
    <>
      <Button
        className="text-xs sm:text-xs"
        onClick={() => setIsOpenReplies(false)}
        outline
      >
        <ArrowUpIcon /> {numReplies} {replyText}
      </Button>
      <Suspense fallback="Getting messages...">
        <ReplyThread replyThreadPromise={replyThreadPromise} />
      </Suspense>
    </>
  )
}
