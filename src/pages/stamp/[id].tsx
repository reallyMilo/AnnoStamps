import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Category from '@/components/Category'
import Container from '@/components/ui/Container'
import { stampIncludeStatement, StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

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
    include: stampIncludeStatement,
    where: { id: params.id },
  })

  return {
    props: {
      stamp,
    },
  }
}

const triggerDownload = (data: Blob, filename: string) => {
  const blobUrl =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(data)
      : window.webkitURL.createObjectURL(data)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobUrl
  tempLink.setAttribute('download', filename)

  document.body.appendChild(tempLink)
  tempLink.click()

  setTimeout(() => {
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobUrl)
  }, 200)
}

//TODO: carousel for images
const Carousel = ({ images }: Pick<StampWithRelations, 'images'>) => {
  if (images.length === 0) {
    return null
  }
  return (
    <Image
      src={images[0].largeUrl ?? images[0].originalUrl}
      alt="Preview of stamp"
      fill
      style={{
        objectFit: 'cover',
      }}
    />
  )
}
const StampPage = ({ stamp }: { stamp: StampWithRelations }) => {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    )
  }

  const {
    title,
    category,
    region,
    description,
    stampFileUrl,
    modded,
    good,
    downloads,
    images,
    user,
    collection,
  } = stamp

  const handleDownload = async () => {
    const res = await fetch(stampFileUrl)
    if (!res.ok) {
      return
    }
    const file = await res.blob()

    const fileNameWithRegion = stamp.title + '_' + stamp.region
    const formattedTitle = fileNameWithRegion.replace(/[^\w\s.]/g, '_')

    triggerDownload(file, formattedTitle)
    await fetch(`/api/stamp/download/${stamp.id}`)
  }

  return (
    <Container className="h-screen space-y-6">
      <div className="relative h-1/2 overflow-hidden rounded-lg shadow-md">
        <Carousel images={images} />
      </div>

      <h1 className=" truncate text-2xl font-semibold">{title} </h1>

      <div className="flex space-x-5">
        {user.usernameURL && (
          <Link
            className="self-center hover:text-sky-700"
            href={`/${user.usernameURL}`}
          >
            {user.username}
          </Link>
        )}

        <Category category={category} />

        <div className="hidden grow space-x-5 text-sm md:flex">
          <div className="self-center capitalize text-[#B11E47]">{region}</div>

          {category === 'production' && (
            <div className="self-center capitalize text-gray-500">{good}</div>
          )}

          {modded && (
            <span className="self-center rounded-full bg-[#6DD3C0] px-4 py-2 text-black">
              <WrenchIcon className="mr-2 inline-block h-5 w-5" />
              mods
            </span>
          )}

          {/* TODO: views */}
          {/* <div className="self-center">
            <EyeIcon className="mr-2 inline-block h-5 w-5" /> Views
          </div> */}
          <div className="self-center">
            <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
            {downloads}
          </div>
        </div>

        {collection && <div className="self-center">Collection</div>}
        <button
          data-testid="stamp-download"
          className="inline-block rounded-md bg-[#6DD3C0] px-4 py-2 font-bold"
          onClick={handleDownload}
        >
          <ArrowDownTrayIcon className="mr-2 inline-block h-6 w-6" />
          Download
        </button>
      </div>

      <p className="col-span-3 break-words text-lg">{description}</p>
      {/* TODO: list of mods used in stamp #70 */}
    </Container>
  )
}

export default StampPage
