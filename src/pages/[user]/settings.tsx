import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import Container from '@/components/ui/Container'

const labelStyle = 'block text-base font-semibold leading-6 text-dark mt-8'
const UserSettingsPage = () => {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const username = session?.user.username
  const [formState, setFormState] = useState<{
    message: string | null
    status: 'idle' | 'sending' | 'error' | 'success'
  }>({ status: 'idle', message: null })

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFormState({ status: 'sending', message: null })
    const formData = new FormData(e.target as HTMLFormElement)

    const updateRes = await fetch(`/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (!updateRes.ok) {
      const updateJson = await updateRes.json()
      setFormState({ status: 'error', message: updateJson.message })
      return
    }
    setFormState({ status: 'success', message: null })
    router.reload()
  }

  return (
    <Container>
      <form
        id="user-settings"
        onSubmit={handleSubmit}
        className="grid max-w-3xl space-y-8"
      >
        <fieldset>
          <legend>
            <h1 className="text-2xl font-bold leading-7 text-dark">Profile</h1>
          </legend>
          <label htmlFor="username" className={labelStyle}>
            Username
          </label>
          <p className="text-xs font-normal leading-6 text-gray-600">
            {username ? (
              <>
                If you wish to change your username please contact us via the
                discord server.
              </>
            ) : (
              <>
                Setting your username allows you to share all your stamps. It
                will also appear on every stamp you upload.
              </>
            )}
          </p>

          <div className="relative mt-4 flex rounded-md font-medium shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
            <span className="flex select-none items-center rounded-l-md pl-3  text-gray-500 sm:text-sm">
              annostamps.com/
            </span>
            <input
              type="text"
              name="username"
              id="username"
              className="block w-full flex-1 rounded-r-md border-0 py-1.5 text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600  invalid:focus:ring-accent sm:text-sm sm:leading-6"
              defaultValue={username ?? ''}
              readOnly={username ? true : false}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).'
                )
              }
              pattern={`^[a-zA-Z0-9_\\-]+$`}
              title="Select a username containing only alphanumeric characters, dashes (-), and underscores (_)."
              required
            />
          </div>

          <label htmlFor="biography" className={labelStyle}>
            About
          </label>
          <textarea
            id="biography"
            name="biography"
            rows={3}
            placeholder="To be displayed on your page banner."
            className="mt-4 block w-full rounded-md border-0 py-1.5 font-normal text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={session?.user.biography ?? ''}
          />
        </fieldset>
        {formState.status === 'error' && (
          <p className="text-accent">{formState.message}</p>
        )}
        <button
          type="submit"
          className="justify-self-end rounded-md bg-secondary px-4 py-2 text-sm font-medium text-dark shadow-sm hover:bg-secondary/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          disabled={formState.status === 'sending'}
        >
          Save
        </button>
      </form>
    </Container>
  )
}
export default UserSettingsPage
