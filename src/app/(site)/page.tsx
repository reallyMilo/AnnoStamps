import { unstable_cache } from 'next/cache'

import { StampCard } from '@/components/StampCard'
import { Container, Grid, Heading, Link } from '@/components/ui'
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
      <div className="space-y-4">
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
