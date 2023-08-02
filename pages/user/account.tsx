import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import z from 'zod'

import Layout from '@/components/Layout/Layout'
import { displayAuthModal } from '@/lib/utils'

const allowedCharactersRegex = /^[a-zA-Z0-9_-]+$/

const Account = () => {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const nickname = formData.get('nickname')
    const usernameValidator = z
      .string()
      .min(1, { message: 'Username must not be empty' })
      .max(50, { message: 'Username must not exceed 50 characters' })
      .refine((value) => allowedCharactersRegex.test(value), {
        message: 'Username contains disallowed characters',
      })

    let toastId
    try {
      usernameValidator.parse(nickname)
      toastId = toast.loading('Saving...')
      await fetch(`/api/user/${nickname}`, { method: 'PUT' })

      toast.success('Successfully saved', { id: toastId })
      router.reload()
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.errors[0]?.message || 'Invalid username', {
          id: toastId,
        })
      } else {
        toast.error('An error occurred, pleas try again later.', {
          id: toastId,
        })
      }
    }
  }
  if (status === 'loading') {
    return (
      <Layout>
        <div className="container mx-auto px-5 py-12">
          <p>login please</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-5 py-12">
        <h1 className="mb-5 text-xl font-bold">Account Details</h1>
        <section className="grid grid-cols-1 space-x-10 md:grid-cols-2">
          <div className="">
            <ul>
              {session.user.name && (
                <li className="pb-5">
                  <p className="mb-2 font-bold">Name</p>
                  <input
                    className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    value={session.user?.name}
                    disabled
                  />
                </li>
              )}

              <li className="pb-5">
                <p className="mb-2 font-bold">Email</p>
                <input
                  className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  value={session.user?.email ?? ''}
                  disabled
                />
              </li>
            </ul>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="nickname" className="mb-2 font-bold">
                Username
              </label>
              <input
                className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                type="text"
                id="nickname"
                name="nickname"
                defaultValue={session.user?.nickname ?? ''}
                placeholder="Sir-Archibald-Blake"
                readOnly={session.user?.nickname ? true : false}
              />
              {session?.user.nickname ? (
                <p className="py-2 text-sm text-slate-400">
                  Notify us if you wish to change your username in discord
                </p>
              ) : (
                <>
                  <p className="py-2 text-sm text-slate-400">
                    You can set a username that will be displayed with your
                    uploaded stamps.
                  </p>
                  <p className="mt-1 flex items-center space-x-6 font-bold text-red-600">
                    <ExclamationCircleIcon className="mr-2 inline-block h-6 w-6" />
                    Usernames are used as your personal shareable stamp page.
                    annostamps.com/YOUR-USERNAME
                  </p>
                  <figure>
                    <figcaption>Username must contain only:</figcaption>
                    <ol>
                      <li>Letters (a-z, A-Z)</li>
                      <li>Digits (0-9)</li>
                      <li>Underscores (_) or Hyphens (-)</li>
                      <li>No other special characters are allowed.</li>
                    </ol>
                  </figure>
                  <button
                    type="submit"
                    className="mt-5 rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
                    data-testid="nickname-submit"
                  >
                    Submit
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </div>
    </Layout>
  )
}
export default Account
