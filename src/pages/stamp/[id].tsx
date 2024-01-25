import 'swiper/css'
import 'swiper/css/navigation'

import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import Category from '@/components/Category'
import LikeButton from '@/components/LikeButton'
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
    revalidate: 30,
  }
}

type CarouselProps = {
  fallBack: string
  images: StampWithRelations['images']
}
const Carousel = ({ images, fallBack }: CarouselProps) => {
  if (images.length === 0) {
    return (
      <Image
        src={fallBack}
        alt="anno stamp image"
        className="max-h-[768px] w-full object-contain object-center"
        height={768}
        width={1024}
      />
    )
  }
  return (
    <Swiper navigation={true} modules={[Navigation]} className="">
      {images.map((image) => (
        <SwiperSlide key={image.id}>
          <Image
            src={image.largeUrl ?? image.originalUrl}
            alt="anno stamp image"
            className="max-h-[768px] w-full object-contain object-center"
            height={768}
            width={1024}
          />
        </SwiperSlide>
      ))}
    </Swiper>
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
    id,
    title,
    category,
    region,
    description,
    stampFileUrl,
    imageUrl,
    modded,
    good,
    downloads,
    images,
    user,
    collection,
    likedBy,
  } = stamp

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
        <LikeButton id={id} likedBy={likedBy} />

        <a
          href={stampFileUrl}
          data-testid="stamp-download"
          className="inline-block rounded-md bg-[#6DD3C0] px-4 py-2 font-bold"
          onClick={() => fetch(`/api/stamp/download/${id}`)}
          download={title}
        >
          <ArrowDownTrayIcon className="mr-2 inline-block h-6 w-6" />
          Download
        </a>
      </div>

      <p className="col-span-3 break-words text-lg">{description}</p>
      {/* TODO: list of mods used in stamp #70 */}
    </Container>
  )
}

export default StampPage
