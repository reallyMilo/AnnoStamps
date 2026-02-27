'use client'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useFormStatus } from 'react-dom'
import TextareaAutosize from 'react-textarea-autosize'

import type { Comment } from '@/lib/prisma/models'

import {
  Button,
  Modal,
  ModalActions,
  ModalDescription,
  ModalTitle,
} from '@/components/ui'
import { useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

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

const UsernameRequiredModal = ({
  ignoreNextFocusRef,
  isOpen = false,
  setIsOpen,
  settingsHref,
}: {
  ignoreNextFocusRef: React.RefObject<boolean>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  settingsHref: string
}) => {
  return (
    <Modal
      className="z-1000"
      data-testid="username-require-modal"
      onClose={setIsOpen}
      open={isOpen}
    >
      <ModalTitle>Set Your Username</ModalTitle>
      <ModalDescription>
        You need to create a username before you can comment on stamps.
      </ModalDescription>
      <ModalActions>
        <Button
          onClick={() => {
            ignoreNextFocusRef.current = true
            setIsOpen(false)
          }}
          plain
        >
          Close
        </Button>
        <Button href={settingsHref}>Set Username</Button>
      </ModalActions>
    </Modal>
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
  const { data: session, isPending } = useSession()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const ignoreNextFocusRef = React.useRef(false)
  const [optimisticComments, addOptimisticComment] = React.useOptimistic<
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
        <span
          className={cn([
            'relative block w-full',
            'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
            'dark:before:hidden',
            'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
            'has-data-disabled:before:bg-midnight/5 has-data-disabled:opacity-50 has-data-disabled:before:shadow-none',
          ])}
          data-slot="control"
        >
          <TextareaAutosize
            aria-label="Comment"
            className={cn([
              'relative block h-full w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
              'text-midnight text-base/6 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
              'border-midnight/10 data-hover:border-midnight/20 border dark:border-white/10 dark:data-hover:border-white/20',
              'bg-transparent dark:bg-white/5',
              'focus:outline-hidden',
              'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-600 dark:data-invalid:data-hover:border-red-600',
              'disabled:border-midnight/20 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:data-hover:disabled:border-white/15',
              'resize-none',
            ])}
            minRows={1}
            name="comment"
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => {
              if (isPending) {
                return
              }
              if (!session) {
                router.push(`/auth/signin?callbackUrl=${pathname}`)
                return
              }
              if (!session.user.username) {
                if (ignoreNextFocusRef.current) {
                  ignoreNextFocusRef.current = false
                  return
                }
                setIsModalOpen(true)
                return
              }
              setIsTextareaFocused(true)
            }}
            placeholder="Add a comment..."
            ref={textareaRef}
            value={content}
          />
        </span>
        {children}
      </form>
      <UsernameRequiredModal
        ignoreNextFocusRef={ignoreNextFocusRef}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        settingsHref={
          session
            ? `/${session.userId}/settings`
            : `/auth/signin?callbackUrl=${pathname}`
        }
      />
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
