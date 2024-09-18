'use client'

import autosize from 'autosize'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useOptimistic } from 'react'

import type { Comment } from '@/lib/prisma/models'

import { Button, Textarea } from '@/components/ui'

import { addCommentToStamp } from './actions'

export const AddCommentForm = ({ id }: { id: string }) => {
  const [content, setContent] = useState('')
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { status } = useSession()
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    Comment[],
    string
  >([], (state, newComment) => [
    {
      content: newComment,
      createdAt: 0,
      id: 'localFirst',
      parentId: null,
      stampId: 'local',
      updatedAt: 0,
      userId: 'local',
    },
    ...state,
  ])

  useEffect(() => {
    const textareaCurrent = textareaRef.current
    if (textareaCurrent) {
      autosize(textareaCurrent)
    }
    return () => {
      if (textareaCurrent) {
        autosize.destroy(textareaCurrent)
      }
    }
  }, [])

  return (
    <>
      <form
        action={async (formData) => {
          addOptimisticComment(formData.get('comment') as string)
          await addCommentToStamp(formData, id)
        }}
        className="flex flex-col space-y-2"
      >
        <Textarea
          aria-label="Comment"
          name="comment"
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => {
            if (status === 'unauthenticated') {
              redirect(`/auth/signin?callbackUrl=/stamp/${id}`)
            }
            setIsTextareaFocused(true)
          }}
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
