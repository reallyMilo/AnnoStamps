import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import * as Yup from 'yup'

import Input from '@/components/Input'
import Layout from '@/components/Layout'
import { prisma } from '@/lib/prisma'
export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context)

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // Get info of the authenticated user
  const singleUser = await prisma.user.findFirst({
    where: { email: session.user.email },
  })

  // Pass the data to the Account component
  return {
    props: {
      user: JSON.parse(JSON.stringify(singleUser)),
      session,
    },
  }
}
const Account = (props) => {
  const router = useRouter()
  const handleSumbit = async (values) => {
    let toastId
    try {
      toastId = toast.loading('Saving...')
      const { data } = await axios.post('/api/username/', { values })
      if (data.nickname) {
        toast.success('Successfully saved', { id: toastId })
        router.push('/account')
      } else {
        toast.error('An error occured, pleas try again later.', {
          id: toastId,
        })
      }
    } catch (e) {
      if (e.response.data.message === 'P2002') {
        toast.error('Username not available!', { id: toastId })
      } else {
        toast.error('An error occured, pleas try again later.', {
          id: toastId,
        })
      }
    }
  }

  return (
    <>
      <Layout>
        <div className="container mx-auto px-5 py-12">
          <h1 className="mb-5 text-xl font-bold">Account Details</h1>
          <section className="grid grid-cols-1 space-x-10 md:grid-cols-2">
            <div className="">
              <ul>
                {props.user.name && (
                  <li className="pb-5">
                    <p className="mb-2 font-bold">Name</p>
                    <input
                      className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      value={props.user.name}
                      disabled
                    />
                  </li>
                )}

                <li className="pb-5">
                  <p className="mb-2 font-bold">Email</p>
                  <input
                    className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    value={props.user.email}
                    disabled
                  />
                </li>
              </ul>
            </div>

            <div>
              {props.user.nickname ? (
                <>
                  <p className="mb-2 font-bold">Username</p>
                  <input
                    className="w-full truncate rounded-md border py-2 pl-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    value={props.user.nickname}
                    disabled
                  />
                </>
              ) : (
                <Formik
                  initialValues={{
                    userName: '',
                  }}
                  validationSchema={Yup.object().shape({
                    userName: Yup.string().max(50).trim().required('Required'),
                  })}
                  onSubmit={handleSumbit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <p className="mb-2 font-bold">Username</p>
                      <Input
                        name="userName"
                        type="text"
                        placeholder={
                          props.user.nickname
                            ? props.user.nickname
                            : 'Sir Archibald Blake'
                        }
                      />
                      <p className="py-2 text-sm text-slate-400">
                        You can set a username that will be displayed with your
                        uploaded stamps.
                        <br />
                        <span className="mt-1 flex items-center space-x-6 font-bold text-red-600">
                          <ExclamationCircleIcon className="mr-2 inline-block h-6 w-6" />
                          Usernames cannot be changed!
                        </span>
                      </p>
                      <button
                        type="submit"
                        disabled={!isValid}
                        className="mt-5 rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}
export default Account
