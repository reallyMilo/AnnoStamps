import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import Layout from '@/components/Layout'
import { prisma } from '@/lib/prisma'

const Listedstamp = (stamp = null) => {
  const router = useRouter()
  const { data: session } = useSession()

  const button = useRef()

  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [stampFile, setStampFile] = useState()
  const [downloadCount, setDownloadCount] = useState(stamp?.downloads)

  useEffect(() => {
    ;(async () => {
      if (session?.user) {
        try {
          const owner = await axios.get(`/api/stamp/${stamp.id}/owner`)
          setIsOwner(owner?.id === session.user.id)
        } catch (e) {
          setIsOwner(false)
        }
      }
    })()
  }, [session?.user, stamp.id])

  const deletestamp = async () => {
    let toastId
    try {
      toastId = toast.loading('Deleting...')
      setDeleting(true)
      // Delete stamp from DB
      await axios.delete(`/api/stamps/${stamp.id}`)
      // Redirect user
      toast.success('Successfully deleted', { id: toastId })
      router.push('/stamps')
    } catch (e) {
      toast.error('Unable to delete stamp', { id: toastId })
      setDeleting(false)
    }
  }

  const incrementDownladsCount = () => {
    axios.post('/api/downloads', { stamp: stamp.id })
    setDownloadCount((prevDownloadCount) => prevDownloadCount + 1)
  }

  return (
    <Layout>
      <div className="mx-auto max-w-screen-lg px-5 py-12">
        <div className="mx-5 flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4">
          {isOwner ? (
            <div className="flex items-center space-x-2">
              {/* <button
                type="button"
                disabled={deleting}
                onClick={() => router.push(`/stamps/${stamp.id}/edit`)}
                className="px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button> */}

              {/* <button
                type="button"
                disabled={deleting}
                onClick={deletestamp}
                className="rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button> */}
            </div>
          ) : null}
        </div>

        <div className="aspect-h-9 aspect-w-16 relative mx-5 mt-6 overflow-hidden rounded-lg bg-gray-200 shadow-md">
          {stamp?.screenshot ? (
            <Image
              src={stamp.screenshot}
              alt={stamp.title}
              fill
              sizes="100vw"
              style={{
                objectFit: 'cover',
              }}
            />
          ) : null}
        </div>
        <h1 className="mx-5 mt-6 truncate text-2xl font-semibold">
          {stamp?.title ?? ''}
        </h1>
        <div className="mx-5 grid grid-cols-1 gap-10 pb-10 md:grid-cols-2">
          <div>
            <ol className="mb-2 mt-4 items-center text-gray-500">
              <li>
                <span className="font-bold">Category:</span>{' '}
                {stamp.category ?? ''}
              </li>
              <li>
                <span className="font-bold">Region:</span> {stamp.region ?? ''}
              </li>
            </ol>
            <a
              href={`${stamp?.stamp}?download=${stamp?.title}`}
              className="mt-5 inline-block rounded-md bg-[#6DD3C0] px-4 py-2 font-bold"
              onClick={incrementDownladsCount}
            >
              <ArrowDownTrayIcon className="mr-2 inline-block h-6 w-6" />
              Download Stamp
            </a>
            <p className="flex cursor-default items-center gap-1 pt-3 text-sm">
              Total Downloads:
              <span className="flex cursor-default items-center gap-1 text-sm">
                {downloadCount}
              </span>
            </p>
          </div>
          <div>
            <p className="break-words text-lg">{stamp.description ?? ''}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  // Get all stamps IDs from the database
  const stamps = await prisma.stamp.findMany({
    select: { id: true },
  })

  return {
    paths: stamps.map((stamp) => ({
      params: { id: stamp.id },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  // Get the current stamp from the database
  const stamp = await prisma.stamp.findUnique({
    where: { id: params.id },
  })

  if (stamp) {
    return {
      props: JSON.parse(JSON.stringify(stamp)),
    }
  }

  // return {
  //   notFound: true,
  // };

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

export default Listedstamp
