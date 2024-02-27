import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import Category from '@/components/Category'
import Container from '@/components/ui/Container'
import { stampIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

import Carousel from './Carousel'
import DownloadButton from './DownloadButton'
import LikeButton from './LikeButton'

const getStamp = unstable_cache(
  async (id: string) => {
    return prisma.stamp.findUnique({
      include: stampIncludeStatement,
      where: { id },
    })
  },
  ['stamp'],
  { revalidate: 300 }
)

const StampPage = async ({ params }: { params: { id: string } }) => {
  const stamp = await getStamp(params.id)
  const session = await auth()

  if (!stamp) {
    notFound()
  }
  const {
    id,
    title,
    category,
    region,
    description,
    imageUrl,
    modded,
    good,
    downloads,
    images,
    user,
    collection,
    likedBy,
  } = stamp

  const userLikedStamp = session
    ? likedBy.some((liked) => liked.id === session.user.id)
    : false

  return (
    <Container className="max-w-5xl space-y-6 px-0">
      <Carousel images={images} fallBack={imageUrl ?? ''} />

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

          {collection && <div className="self-center">Collection</div>}
          {/* TODO: views */}
          {/* <div className="self-center">
            <EyeIcon className="mr-2 inline-block h-5 w-5" /> Views
          </div> */}
          <div className="self-center">
            <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
            {downloads}
          </div>
        </div>
        <LikeButton
          id={id}
          initialLikes={likedBy.length}
          liked={userLikedStamp}
        />
        <DownloadButton {...stamp} />
      </div>

      <p className="col-span-3 break-words text-lg">{description}</p>
      {/* TODO: list of mods used in stamp #70 */}
    </Container>
  )
}

export default StampPage
