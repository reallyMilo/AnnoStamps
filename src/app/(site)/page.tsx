import { unstable_cache } from 'next/cache'
import Image from 'next/image'

import anno117 from '@/../public/anno117-icon.jpg'
import anno1800 from '@/../public/anno1800-icon.webp'
import { StampCard } from '@/components/StampCard'
import {
  Button,
  Container,
  Grid,
  Heading,
  Link,
  Strong,
  Text,
} from '@/components/ui'
import { stampIncludeStatement } from '@/lib/prisma/models'
import prisma from '@/lib/prisma/singleton'

const getHomePageStamps = unstable_cache(
  async () =>
    prisma.stamp.findMany({
      include: stampIncludeStatement,
      orderBy: { createdAt: 'desc' },
      take: 8,
      where: {
        game: '117',
      },
    }),
  ['home-page-stamps'],
  {
    revalidate: 3600,
  },
)

const HomePage = async () => {
  const newestStamps = await getHomePageStamps()
  return (
    <Container className="pt-10">
      <div className="space-y-8 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm md:p-10 dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="space-y-3">
          <Heading>Version Switching Is Live</Heading>
          <Text className="max-w-3xl">
            AnnoStamps now supports game versions from the top header switcher.
            <Strong>
              {' '}
              Anno 1800 is the active upload version right now.
            </Strong>{' '}
            Anno 117 uploads are temporarily disabled until that stamp format is
            fully ready.
          </Text>
        </div>

        <Grid className="grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center gap-3">
              <Image alt="Anno 117 icon" height={28} src={anno117} width={28} />
              <Heading className="text-lg">117</Heading>
            </div>
            <Text>
              Use this tab to browse 117 pages and prepare for upcoming uploads.
            </Text>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center gap-3">
              <Image
                alt="Anno 1800 icon"
                height={28}
                src={anno1800}
                width={28}
              />
              <Heading className="text-lg">1800</Heading>
            </div>
            <Text>
              Current live version for browsing, creating, and editing stamps.
            </Text>
          </div>
        </Grid>

        <div className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-700/60 dark:bg-amber-950/20">
          <Heading className="text-lg">How To Switch Versions</Heading>
          <Text>
            Use the version buttons in the top header bar. Click{' '}
            <Strong>117</Strong> or <Strong>1800</Strong> to jump between
            equivalent pages.
          </Text>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button color="secondary" href="/1800">
            Open Anno 1800 Home
          </Button>
          <Button href="/1800/stamps" outline>
            Browse 1800 Stamps
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-16">
        <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
          <Heading>New 117 Stamps</Heading>
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

export default HomePage
