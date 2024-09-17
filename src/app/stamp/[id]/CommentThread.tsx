'use client'

import autosize from 'autosize'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOptimistic } from 'react'

import type { Comment } from '@/lib/prisma/models'

import { Button, Textarea } from '@/components/ui'

import { addCommentToStamp } from './actions'

type CommentThreadProps = { comments: Comment[]; id: string }

export const CommentThread = ({ comments, id }: CommentThreadProps) => {
  const [content, setContent] = useState('')
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node) &&
        content.length === 0
      ) {
        setIsTextareaFocused(false)
      }
    },
    [content.length],
  )

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment) => [
      {
        content: newComment as string,
        createdAt: 0,
        id: 'localFirst',
        parentId: null,
        stampId: 'local',
        updatedAt: 0,
        userId: 'local',
      },
      ...state,
    ],
  )

  useEffect(() => {
    const textareaCurrent = textareaRef.current
    if (textareaCurrent) {
      autosize(textareaCurrent)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      if (textareaCurrent) {
        autosize.destroy(textareaCurrent)
      }
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <>
      <form
        action={async (formData) => {
          addOptimisticComment(formData.get('comment'))
          await addCommentToStamp(formData, id)
        }}
        className="flex flex-col space-y-2"
      >
        <Textarea
          aria-label="Comment"
          name="comment"
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          placeholder="Add a comment..."
          ref={textareaRef}
          resizable={false}
          rows={1}
          value={content}
        />
        {isTextareaFocused && (
          <Button
            className="cursor-pointer self-end"
            color="secondary"
            disabled={content.length === 0}
            type="submit"
          >
            Comment
          </Button>
        )}
      </form>
      {optimisticComments.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </>
  )
}
