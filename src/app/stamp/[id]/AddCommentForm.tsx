'use client'
import autosize from 'autosize'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'

import type { Comment } from '@/lib/prisma/models'
import type { ServerAction } from '@/lib/utils'

import { Button, Textarea } from '@/components/ui'

import { CommentItem } from './CommentItem'

const AddCommentContext = React.createContext<any | null>(null)

const useAddCommentContext = () => {
  const context = React.useContext(AddCommentContext)
  if (!context) {
    throw new Error('needs to be used within AddComment Provider')
  }
  return context
}

const ShowFormButton = ({ children }: React.PropsWithChildren) => {
  const { isFormVisible, setIsFormVisible, setIsTextareaFocused, textareaRef } =
    useAddCommentContext()

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  })
  return (
    <div className="space-y-2">
      <Button
        className="max-w-fit text-xs sm:text-xs"
        data-testid="comment-reply-button"
        onClick={() => {
          setIsTextareaFocused(true)
          setIsFormVisible(true)
          if (textareaRef.current) {
            textareaRef.current.focus()
          }
        }}
        plain
      >
        Reply
      </Button>
      {isFormVisible && <>{children}</>}
    </div>
  )
}
const FormActionButtons = ({ children }: React.PropsWithChildren) => {
  const {
    content,
    isTextareaFocused,
    setContent,
    setIsFormVisible,
    setIsTextareaFocused,
  } = useAddCommentContext()
  const { pending } = useFormStatus()

  if (!isTextareaFocused) {
    return null
  }
  return (
    <div className="flex justify-end space-x-2">
      <Button
        className="cursor-pointer"
        onClick={() => {
          setIsFormVisible(false)
          setIsTextareaFocused(false)
          setContent('')
        }}
        plain
      >
        Cancel
      </Button>
      <Button
        className="cursor-pointer"
        color="secondary"
        data-testid="comment-submit-button"
        disabled={content.length === 0 || pending}
        type="submit"
      >
        {children}
      </Button>
    </div>
  )
}

const Form = ({
  action,
  children,
}: React.PropsWithChildren<{
  action: any
}>) => {
  const { content, setContent, setIsTextareaFocused, textareaRef } =
    useAddCommentContext()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    Omit<Comment, '_count'>[],
    string
  >([], (state, newComment) => [
    {
      content: newComment,
      createdAt: Math.floor(Date.now() / 1000),
      id: 'optimistic',
      parentId: null,
      stampId: 'optimistic',
      updatedAt: Math.floor(Date.now() / 1000),
      user: {
        id: session?.userId ?? '1',
        image: session?.user.image ?? null,
        username: session?.user.username ?? null,
        usernameURL: session?.user.usernameURL ?? null,
      },
      userId: 'optimistic',
    },
    ...state,
  ])

  React.useEffect(() => {
    const textareaRefCurrent = textareaRef.current
    if (textareaRefCurrent) {
      autosize(textareaRefCurrent)
    }
    return () => {
      if (textareaRefCurrent) {
        autosize.destroy(textareaRefCurrent)
      }
    }
  }, [textareaRef])

  return (
    <>
      <form
        action={async (formData) => {
          addOptimisticComment(formData.get('comment') as string)
          const res = await action(formData)
          if (!res.ok) {
            //TODO: comment action error handling
            return
          }

          setContent('')

          setIsTextareaFocused(false)
        }}
        className="flex flex-col space-y-2"
      >
        <Textarea
          aria-label="Comment"
          name="comment"
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => {
            if (status === 'unauthenticated') {
              router.push(`/auth/signin?callbackUrl=${pathname}`)
            }
            if (!session?.user.username) {
              router.push(`/${session?.userId}/settings`)
            }
            setIsTextareaFocused(true)
          }}
          placeholder="Add a comment..."
          ref={textareaRef}
          resizable={false}
          rows={1}
          value={content}
        />
        {children}
      </form>
      <ul>
        {optimisticComments.map((message) => (
          <CommentItem key={message.id} {...message} />
        ))}
      </ul>
    </>
  )
}

const Root = ({
  children,
  isVisible = true,
}: React.PropsWithChildren<{ isVisible?: boolean }>) => {
  const [isFormVisible, setIsFormVisible] = React.useState(isVisible)
  const [isTextareaFocused, setIsTextareaFocused] = React.useState(false)
  const [content, setContent] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const context = React.useMemo(
    () => ({
      content,
      isFormVisible,
      isTextareaFocused,
      setContent,
      setIsFormVisible,
      setIsTextareaFocused,
      textareaRef,
    }),
    [
      isFormVisible,
      setIsFormVisible,
      isTextareaFocused,
      setIsTextareaFocused,
      content,
      setContent,
      textareaRef,
    ],
  )
  return (
    <AddCommentContext.Provider value={context}>
      {children}
    </AddCommentContext.Provider>
  )
}

const AddCommentForm = {
  Form,
  FormActionButtons,
  Root,
  ShowFormButton,
}

export { AddCommentForm, useAddCommentContext }
