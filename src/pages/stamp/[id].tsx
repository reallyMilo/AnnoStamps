import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/router'

import Container from '@/components/ui/Container'
import { prisma } from '@/lib/prisma/singleton'
import { triggerDownload } from '@/lib/utils'
import { StampWithLikes } from '@/types'

export async function getStaticPaths() {
  const stamps = await prisma.stamp.findMany({
    select: { id: true },
    orderBy: { downloads: 'desc' },
    take: 20,
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
      likedBy: {
        select: {
          id: true,
        },
      },
    },
    where: { id: params.id },
  })

  return {
    props: {
      stamp,
    },
  }
}

const StampPage = ({ stamp }: { stamp: StampWithLikes }) => {
  const router = useRouter()

  const handleDownload = async () => {
    const res = await fetch(stamp?.stampFileUrl)
    if (!res.ok) {
      return
    }
    const file = await res.blob()
    //FIXME: files responding with text/html
    const newFile = file.slice(0, file.size, 'application/octet-stream')
    const fileNameWithRegion = stamp.title + '_' + stamp.region
    const formattedTitle = fileNameWithRegion.replace(/[^\w\s.]/g, '_')

    triggerDownload(newFile, formattedTitle)
    await fetch(`/api/stamp/download/${stamp.id}`)
  }
  if (router.isFallback) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    )
  }

  return (
    <Container>
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
            <li className="capitalize">
              <span className="font-bold">Category:</span> {stamp?.category}
            </li>
            <li className="capitalize">
              <span className="font-bold">Region:</span> {stamp?.region}
            </li>
          </ol>
          <button
            data-testid="stamp-download"
            className="mt-5 inline-block rounded-md bg-[#6DD3C0] px-4 py-2 font-bold"
            onClick={handleDownload}
          >
            <ArrowDownTrayIcon className="mr-2 inline-block h-6 w-6" />
            Download Stamp
          </button>
          <p className="flex cursor-default items-center gap-1 pt-3 text-sm">
            Total Downloads:
            <span className="flex cursor-default items-center gap-1 text-sm">
              {stamp?.downloads}
            </span>
          </p>
        </div>

        <p className="break-words text-lg">{stamp?.description}</p>
      </div>
    </Container>
  )
}

export default StampPage