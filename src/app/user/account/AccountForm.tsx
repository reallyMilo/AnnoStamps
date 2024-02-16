'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { updateUser } from '../actions'

const AccountForm = () => {
  const { data: session } = useSession()
  const { pending } = useFormStatus()
  const [state, formAction] = useFormState(updateUser, {
    username: session?.user.username,
    biography: session?.user.biography,
    ok: true,
    message: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.patternMismatch) {
      setErrorMessage(
        'Only alphanumeric, dashes(-) and underscores(_) accepted.'
      )
      return
    }

    setErrorMessage(null)
  }

  return (
    <form id="user-settings" action={formAction}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Setting your username allows you to share all your stamps. It will
              also appear on every stamp you upload.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <span className="flex select-none items-center rounded-l-md pl-3 text-gray-500 sm:text-sm">
                    annostamps.com/
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="block w-full flex-1 rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={state.username ?? ''}
                    readOnly={state.username ? true : false}
                    pattern={`^[a-zA-Z0-9_\\-]+$`}
                    title="alphanumeric characters, dashes, and underscores"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {(errorMessage || !state.ok) && (
                <p
                  className="mt-2 text-sm text-red-600"
                  aria-live="polite"
                  id="username-error"
                >
                  {errorMessage}
                  {state?.message}
                </p>
              )}

              {state.username && (
                <p className="mt-2 text-xs">
                  If you wish to change your username please contact us via the
                  discord server.
                </p>
              )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="biography"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="biography"
                  name="biography"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={state.biography ?? ''}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                To be displayed on your page banner.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          aria-disabled={pending}
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default AccountForm
