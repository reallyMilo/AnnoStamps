import type { PropsWithChildren } from 'react'

import type { Comment } from '@/lib/prisma/models'

import { AvatarButton, Link, Text } from '@/components/ui'
import { distanceUnixTimeToNow } from '@/lib/prisma/utils'

import { CommentView } from './CommentView'

type CommentItemProps = {
  level?: number
  replyToUser?: {
    id: string
    username: string
    usernameURL: string
  }
} & Pick<Comment, 'content' | 'createdAt' | 'id' | 'parentId' | 'user'>

export const CommentItem = ({
  children,
  content,
  createdAt,
  id: commentId,
  level,
  parentId,
  replyToUser,
  user,
}: PropsWithChildren<CommentItemProps>) => {
  return (
    <li id={commentId}>
      <div className="flex space-x-5 pb-2">
        <AvatarButton className="self-start" src={user.image} />
        <div className="flex flex-grow flex-col">
          <div className="flex space-x-5">
            <Link
              className="text-midnight hover:text-primary dark:text-white"
              href={`/${user.usernameURL}`}
            >
              {user.username}
            </Link>
            <Text suppressHydrationWarning>
              {distanceUnixTimeToNow(createdAt)}
            </Text>
          </div>
          <div className="flex space-x-4">
            {parentId && level && level > 1 && replyToUser && (
              <a href={`#${parentId}`}>@{replyToUser.username}</a>
            )}
            <Text>{content}</Text>
          </div>
          <CommentView
            parentId={commentId}
            userIdToNotify={replyToUser?.id as string}
          />
        </div>
      </div>
      {children}
    </li>
  )
}
