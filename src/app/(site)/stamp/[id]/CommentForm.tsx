'use client'
import autosize from 'autosize'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'

import type { Comment } from '@/lib/prisma/models'

import { Button, Textarea } from '@/components/ui'
import { useSession } from '@/lib/auth-client'

import { CommentItem } from './CommentItem'

type CommentContextProps = {
  content: string
  isFormVisible: boolean
  isTextareaFocused: boolean
  setContent: React.Dispatch<React.SetStateAction<string>>
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>
  setIsTextareaFocused: React.Dispatch<React.SetStateAction<boolean>>
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const CommentContext = React.createContext<CommentContextProps | null>(null)

const useCommentContext = () => {
  const context = React.useContext(CommentContext)
  if (!context) {
    throw new Error('needs to be used within AddComment Provider')
  }
  return context
}

const ShowFormButton = ({ children }: React.PropsWithChildren) => {
  const { isFormVisible, setIsFormVisible, setIsTextareaFocused, textareaRef } =
    useCommentContext()

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
  } = useCommentContext()
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
  action: (formData: FormData) => Promise<{
    error?: string
    message?: string
    ok: boolean
  }>
}>) => {
  const { content, setContent, setIsTextareaFocused, textareaRef } =
    useCommentContext()
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

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
            if (!session) {
              router.push(`/auth/signin?callbackUrl=${pathname}`)
              return
            }
            if (!session?.user.username) {
              //TODO: set username modal that notifies
              router.push(`/${session?.userId}/settings`)
              return
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
    <CommentContext.Provider value={context}>
      {children}
    </CommentContext.Provider>
  )
}

const CommentForm = {
  Form,
  FormActionButtons,
  Root,
  ShowFormButton,
}

export { CommentForm, useCommentContext }
