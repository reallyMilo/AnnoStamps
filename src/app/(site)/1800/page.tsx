import { unstable_cache } from 'next/cache'
import Image, { type StaticImageData } from 'next/image'
import anno1800Header from 'public/Anno1800Header.webp'
import arctic from 'public/Arctic.webp'
import enbesa from 'public/Enbesa.webp'
import newWorld from 'public/NewWorld.webp'
import oldWorld from 'public/OldWorld.webp'
import qs from 'qs'

import { StampCard } from '@/components/StampCard'
import { Container, Grid, Heading, Link } from '@/components/ui'
import { REGIONS_1800 } from '@/lib/constants/1800/data'
import { stampIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'

const regionLinks = [
  {
    href: 'old world',
    imgSrc: oldWorld,
  },
  {
    href: 'new world',
    imgSrc: newWorld,
  },
  {
    href: 'arctic',
    imgSrc: arctic,
  },
  {
    href: 'enbesa',
    imgSrc: enbesa,
  },
] satisfies {
  href: (typeof REGIONS_1800)[keyof typeof REGIONS_1800]
  imgSrc: StaticImageData
}[]

const getLatestStamps = unstable_cache(
  async () =>
    prisma.stamp.findMany({
      include: stampIncludeStatement,
      orderBy: { createdAt: 'desc' },
      take: 8,
      where: {
        game: '1800',
      },
    }),
  ['version-1800-latest-stamps'],
  {
    revalidate: 3600,
  },
)

const Version1800Page = async () => {
  const newestStamps = await getLatestStamps()

  return (
    <Container className="pt-2">
      <Image
        alt="Anno 1800 game start screen"
        className="object-fit max-h-52 rounded-md"
        priority
        src={anno1800Header}
      />
      <Grid className="mt-8 grid-cols-2 lg:grid-cols-4">
        {regionLinks.map((region, idx) => (
          <Link
            className="hover:opacity-75"
            href={`stamps?${qs.stringify({ region: region.href })}`}
            key={`${region.href}-img-${idx}`}
          >
            <Image
              alt="anno 1800 game region"
              className="rounded-md shadow-md"
              priority
              src={region.imgSrc}
            />
          </Link>
        ))}
      </Grid>
      <div className="space-y-4 pt-16">
        <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
          <Heading>New Stamps</Heading>
          <Link className="dark:text-white" href="/stamps">
            Browse all stamps
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
        <Grid>
          {newestStamps.map((stamp) => (
            <StampCard key={stamp.id} {...stamp} />
          ))}
        </Grid>
      </div>
    </Container>
  )
}

export default Version1800Page
