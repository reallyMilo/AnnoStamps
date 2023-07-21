import { Stamp } from '@prisma/client'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import Grid from '@/components/Layout/Grid'
import Layout from '@/components/Layout/Layout'
import StampCard from '@/components/StampCard'
import { fetcher } from '@/lib/utils'

export default function NicknamePage() {
  const router = useRouter()
  const { data, error, isLoading } = useSWR(
    `/api/user/${router.query.nickname}`,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-5 py-12">
        <Grid>
          {data.listedStamps.map((stamp: Stamp) => (
            <StampCard key={stamp.id} {...stamp} />
          ))}
        </Grid>
      </div>
    </Layout>
  )
}
