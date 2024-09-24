import type { PropsWithChildren } from 'react'

import type { Comment } from '@/lib/prisma/models'

import { AvatarButton, Link, Text } from '@/components/ui'

import { CommentView } from './CommentView'

export const CommentItem = ({
  children,
  content,
  createdAt,
  id: commentId,
  user,
}: PropsWithChildren<
  Pick<Comment, 'content' | 'createdAt' | 'id' | 'user'>
>) => {
  return (
    <li>
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
            <Text suppressHydrationWarning>{createdAt}</Text>
          </div>
          <Text>{content}</Text>
          <CommentView parentId={commentId} />
        </div>
      </div>
      {children}
    </li>
  )
}
