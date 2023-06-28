import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import type { User } from '@prisma/client'
import Image from 'next/image'
import useSWRMutation from 'swr/mutation'

import Layout from '@/components/Layout/Layout'
import { prisma } from '@/lib/prisma'
import { sendRequest } from '@/lib/utils'

export async function getStaticPaths() {
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
type Params = {
  params: {
    id: string
  }
}

export async function getStaticProps({ params }: Params) {
  const stamp = await prisma.stamp.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      stampFileUrl: true,
      category: true,
      region: true,
      modded: true,
      downloads: true,
      likedBy: true,
    },
    where: { id: params.id },
  })

  if (stamp) {
    return {
      props: {
        stamp,
      },
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}
//TODO: on edit define props for queries
type ListedStampProps = {
  category: string
  description: string
  downloads: number
  id: string
  imageUrl: string
  likedBy: User[]
  modded: boolean
  region: string
  stampFileUrl: string
  title: string
}
const Listedstamp = ({ stamp }: { stamp: ListedStampProps }) => {
  const { trigger } = useSWRMutation('/api/downloads', sendRequest)

  const incrementDownloads = async () => {
    await trigger(stamp.id)
  }

  return (
    <Layout>
      <div className="mx-auto max-w-screen-lg px-5 py-12">
        <div className="aspect-h-9 aspect-w-16 relative mx-5 mt-6 overflow-hidden rounded-lg bg-gray-200 shadow-md">
          {stamp?.imageUrl && (
            <Image
              src={stamp.imageUrl}
              alt={stamp.title}
              fill
              sizes="100vw"
              style={{
                objectFit: 'cover',
              }}
            />
          )}
        </div>
        <h1 className="mx-5 mt-6 truncate text-2xl font-semibold">
          {stamp?.title}
        </h1>
        <div className="mx-5 grid grid-cols-1 gap-10 pb-10 md:grid-cols-2">
          <div>
            <ol className="mb-2 mt-4 items-center text-gray-500">
              <li>
                <span className="font-bold">Category:</span> {stamp?.category}
              </li>
              <li>
                <span className="font-bold">Region:</span> {stamp?.region}
              </li>
            </ol>
            <a
              href={`${stamp?.stampFileUrl}?download=${stamp?.title}`}
              className="mt-5 inline-block rounded-md bg-[#6DD3C0] px-4 py-2 font-bold"
              onClick={incrementDownloads}
            >
              <ArrowDownTrayIcon className="mr-2 inline-block h-6 w-6" />
              Download Stamp
            </a>
            <p className="flex cursor-default items-center gap-1 pt-3 text-sm">
              Total Downloads:
              <span className="flex cursor-default items-center gap-1 text-sm">
                {stamp?.downloads}
              </span>
            </p>
          </div>

          <p className="break-words text-lg">{stamp?.description}</p>
          <p>Direct stamp link if download fails: {stamp?.stampFileUrl}</p>
        </div>
      </div>
    </Layout>
  )
}

export default Listedstamp
