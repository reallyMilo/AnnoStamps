import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import Layout from '@/components/Layout/Layout'
import Container from '@/components/ui/Container'
import { displayAuthModal } from '@/lib/utils'

const Account = () => {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      displayAuthModal()
    },
  })

  const username = session?.user.username
  const [isError, setIsError] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.patternMismatch) {
      setIsError(true)
      return
    }

    setIsError(false)
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username')

    try {
      await fetch(`/api/user/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
      router.reload()
    } catch (e) {
      toast.error('Failed to update data!')
    }
  }
  if (status === 'loading') {
    return (
      <Layout>
        <Container>
          <p>login please</p>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Setting your username allows you to share all your stamps. It
                  will also appear on every stamp you upload.
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
                        type="text"
                        name="username"
                        id="username"
                        className="block w-full flex-1 rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={username ?? ''}
                        readOnly={username ? true : false}
                        pattern={`^[a-zA-Z0-9_\\-]+$`}
                        title="alphanumeric characters, dashes, and underscores"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {isError && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="username-error"
                    >
                      Only alphanumeric, dashes(-) and underscores(_) accepted.
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
                      defaultValue={session.user?.biography}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    To be displayed on your page banner.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Socials
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Social contacts that you add will be displayed on your
                  annostamps.com/username page for users to contact you.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="emailContact"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Contact
                  </label>
                  <div className="mt-2">
                    <input
                      id="emailContact"
                      name="emailContact"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Email contact to be displayed"
                      defaultValue={session.user?.emailContact}
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  {/* Discord */}
                  <label
                    htmlFor="discord"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Discord
                  </label>
                  <div className="mt-2">
                    <input
                      id="discord"
                      name="discord"
                      type="text"
                      autoComplete="off"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Discord username"
                      defaultValue={session.user?.discord}
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  {/* Twitter */}
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Twitter
                  </label>
                  <div className="mt-2">
                    <input
                      id="twitter"
                      name="twitter"
                      type="text"
                      autoComplete="off"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Twitter handle"
                      defaultValue={session.user?.twitter}
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  {/* Reddit */}
                  <label
                    htmlFor="reddit"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Reddit
                  </label>
                  <div className="mt-2">
                    <input
                      id="reddit"
                      name="reddit"
                      type="text"
                      autoComplete="off"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Reddit username"
                      defaultValue={session.user?.reddit}
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  {/* Twitch */}
                  <label
                    htmlFor="twitch"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Twitch
                  </label>
                  <div className="mt-2">
                    <input
                      id="twitch"
                      name="twitch"
                      type="text"
                      autoComplete="off"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Twitch username"
                      defaultValue={session.user?.twitch}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </Container>
    </Layout>
  )
}
export default Account
