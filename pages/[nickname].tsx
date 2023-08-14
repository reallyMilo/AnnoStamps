import { Stamp } from '@prisma/client'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import Grid from '@/components/Layout/Grid'
import Layout from '@/components/Layout/Layout'
import StampCard from '@/components/StampCard'
import { fetcher } from '@/lib/utils'

const NicknamePage = () => {
  const router = useRouter()

  const nicknameURL =
    typeof router.query.nickname === 'string' ? router.query.nickname : ''

  const { data, error, isLoading } = useSWR(
    nicknameURL ? `/api/user/${nicknameURL}` : null,
    fetcher
  )

  if (error || !data?.listedStamps)
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl px-5 py-12">
          <h1>{nicknameURL} Stamps</h1>
          <Grid>
            <p>User has no Stamps</p>
          </Grid>
        </div>
      </Layout>
    )
  if (isLoading)
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl px-5 py-12">
          <h1>{nicknameURL} Stamps</h1>
          <Grid>
            <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
          </Grid>
        </div>
      </Layout>
    )

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-5 py-12">
        <h1 className="mb-5">{data.nickname} Stamps</h1>
        <Grid>
          {data.listedStamps.map((stamp: Stamp) => (
            <StampCard key={stamp.id} {...stamp} />
          ))}
        </Grid>
      </div>
    </Layout>
  )
}

export default NicknamePage
