import 'swiper/css'
import 'swiper/css/navigation'

import { ArrowDownTrayIcon, WrenchIcon } from '@heroicons/react/24/solid'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import LikeButton from '@/components/LikeButton'
import { StampCategoryIcon } from '@/components/StampCategoryIcon'
import { buttonStyles, Container, Heading } from '@/components/ui'
import { stampIncludeStatement, StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'
import { cn, distanceUnixTimeToNow } from '@/lib/utils'

export const getStaticPaths = (async () => {
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
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return {
      notFound: true,
    }
  }
  const stamp = await prisma.stamp.findUnique({
    include: stampIncludeStatement,
    where: { id: params.id },
  })

  if (!stamp) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      stamp,
    },
    revalidate: 3600, // revalidate every hour to update stats
  }
}) satisfies GetStaticProps<{ stamp: StampWithRelations }>

type CarouselProps = {
  images: StampWithRelations['images']
}
const Carousel = ({ images }: CarouselProps) => {
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
const StampPage = ({
  stamp,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
    modded,
    good,
    downloads,
    images,
    user,
    collection,
    likedBy,
    createdAt,
    changedAt,
  } = stamp

  return (
    <Container className="max-w-5xl space-y-6 px-0">
      <Carousel images={images} />
      <div className="space-y-6 px-2 sm:px-0">
        <Heading className="truncate">{title} </Heading>

        <div className="flex items-center space-x-5">
          {user.usernameURL && (
            <Link className=" hover:text-sky-700" href={`/${user.usernameURL}`}>
              {user.username}
            </Link>
          )}
          {modded && (
            <div className="flex w-fit items-center gap-1 rounded-full bg-accent py-1 pl-2 pr-3 text-xs capitalize text-white">
              <WrenchIcon className="h-5 w-5" />
              mods
            </div>
          )}
          <div className="hidden sm:block">
            <StampCategoryIcon category={category} />
          </div>

          <div className="hidden grow space-x-5 text-sm md:flex">
            <div className=" capitalize text-accent">{region}</div>

            {category === 'production' && (
              <div className="capitalize text-gray-500">{good}</div>
            )}

            {collection && <div>Collection</div>}
            {/* TODO: views */}
            {/* <div className="">
            <EyeIcon className="mr-2 inline-block h-5 w-5" /> Views
          </div> */}
            <div>
              <ArrowDownTrayIcon className="mr-2 inline-block h-5 w-5" />
              <span data-testid="stamp-downloads">{downloads}</span>
            </div>

            <div suppressHydrationWarning>
              {distanceUnixTimeToNow(createdAt)}
            </div>
          </div>
          <LikeButton id={id} initialLikes={likedBy.length} />

          <a
            href={stampFileUrl}
            data-testid="stamp-download"
            className={cn(
              buttonStyles.base,
              buttonStyles.solid,
              buttonStyles.colors.primary
            )}
            onClick={() => fetch(`/api/stamp/download/${id}`)}
            download={title}
          >
            <ArrowDownTrayIcon />
            Download
          </a>
        </div>

        {createdAt !== changedAt && (
          <div className="italic" suppressHydrationWarning>
            Updated: {distanceUnixTimeToNow(changedAt)}
          </div>
        )}
        <p className="col-span-3 break-words text-lg">{description}</p>
      </div>
    </Container>
  )
}

export default StampPage
