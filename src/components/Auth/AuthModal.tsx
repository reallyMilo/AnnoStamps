import { Dialog, Transition } from '@headlessui/react'
import { EnvelopeOpenIcon, XMarkIcon } from '@heroicons/react/24/outline'
import * as Sentry from '@sentry/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { cn } from '@/lib/utils'

const Confirm = ({ email }: { email: string | null }) => (
  <Transition appear show={email ? true : false} as={Fragment}>
    <div className="fixed inset-0 z-50">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-white" />
      </Transition.Child>

      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="flex h-full items-center justify-center p-8">
          <div className="transform overflow-hidden transition-all">
            <h3 className="text-center text-lg font-medium leading-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <EnvelopeOpenIcon className="h-12 w-12 shrink-0 text-rose-500" />
              </div>
              <p className="mt-2 text-2xl font-semibold">Confirm your email</p>
            </h3>

            <p className="mt-4 text-center text-lg">
              We emailed a magic link to <strong>{email}</strong>.
              <br />
              Check your inbox and click the link in the email to login or sign
              up.
            </p>
          </div>
        </div>
      </Transition.Child>
    </div>
  </Transition>
)

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const openModal = () => {
      setIsOpen(true)
    }
    window.addEventListener('open-auth-modal', openModal)

    return () => {
      window.removeEventListener('open-auth-modal', openModal)
    }
  }, [])

  const signInWithEmail = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const sendingEmailToastId = toast.loading('Sending magic link...')

    const response = await signIn('email', {
      redirect: false,
      callbackUrl: window.location.href,
      email: formData.get('email'),
    })

    if (response?.error) {
      toast.dismiss(sendingEmailToastId)
      toast.error(response.error)
      Sentry.captureException(response.error)
    }
    setEmail(formData.get('email') as string)
  }

  const signInWithGoogle = () => {
    toast.loading('Redirecting...')

    signIn('google', {
      callbackUrl: window.location.href,
    })
  }

  const signInWithDiscord = () => {
    toast.loading('Redirecting...')

    signIn('discord', {
      callbackUrl: window.location.href,
    })
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. can be create portal? */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              data-testid="auth-modal"
              className="relative mx-5 my-8 inline-block w-auto max-w-md transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all sm:rounded-md"
            >
              {/* Close icon */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 shrink-0 rounded-md p-1 transition hover:bg-gray-100 focus:outline-none"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>

              <div className="py-12">
                <div className="px-4 sm:px-12">
                  <div className="flex justify-center">
                    <Link href="/" className="flex items-center space-x-1">
                      <Image
                        src="/anno-stamps-logo.svg"
                        width="160"
                        height="60"
                        alt="Anno Stamps"
                        style={{
                          width: '160px',
                          maxWidth: '160px',
                          height: '60px',
                        }}
                        data-testid="anno-stamp-logo"
                      />
                    </Link>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-6 text-center text-lg font-bold sm:text-2xl"
                  >
                    Welcome!
                  </Dialog.Title>

                  <div className="mt-10">
                    {/* Sign with Google */}
                    <button
                      onClick={() => signInWithGoogle()}
                      className="mx-auto flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                      data-testid="google-sign-in"
                    >
                      <Image
                        src="/google.svg"
                        alt="google sign in"
                        width={32}
                        height={32}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                        }}
                        data-testid="google-icon"
                      />
                      <span>Sign in with Google</span>
                    </button>
                    <button
                      onClick={() => signInWithDiscord()}
                      className="mx-auto mt-4 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                      data-testid="discord-sign-in"
                    >
                      <Image
                        src="/discord.svg"
                        alt="discord sign in"
                        width={32}
                        height={32}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                        }}
                        data-testid="discord-icon"
                      />
                      <span>Sign in with Discord</span>
                    </button>
                    <form className="mt-4" onSubmit={signInWithEmail}>
                      <div className="flex flex-col space-y-1">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              id="email"
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                              className={cn(
                                'w-full truncate rounded-md border border-gray-300 py-2 pl-4 shadow-sm transition focus:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50'
                              )}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="mt-6 w-full rounded-md bg-rose-600 px-8 py-2 text-white transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-600"
                      >
                        Sign in
                      </button>

                      <Confirm email={email} />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AuthModal
