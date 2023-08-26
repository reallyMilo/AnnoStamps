import { XCircleIcon } from '@heroicons/react/20/solid'
import { Stamp } from '@prisma/client'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import Grid from '@/components/Layout/Grid'
import Layout from '@/components/Layout/Layout'
import StampCard from '@/components/StampCard'
import { fetcher } from '@/lib/utils'

const UsernamePage = () => {
  const router = useRouter()

  const usernameURL =
    typeof router.query.username === 'string' ? router.query.username : ''

  const { data, error, isLoading } = useSWR(
    usernameURL ? `/api/user/${usernameURL}` : null,
    fetcher
  )

  if (error)
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl px-5 py-12">
          <h1>{usernameURL}</h1>
          <Grid>
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error.info.message}
                  </h3>
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </Layout>
    )
  if (isLoading)
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl px-5 py-12">
          <h1>{usernameURL} Stamps</h1>
          <Grid>
            <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
          </Grid>
        </div>
      </Layout>
    )

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-5 py-12">
        <h1 className="mb-5">{data?.username} Stamps</h1>
        <Grid>
          {data?.listedStamps.length === 0 ? (
            <p>User has no stamps</p>
          ) : (
            data?.listedStamps.map((stamp: Stamp) => (
              <StampCard key={stamp.id} {...stamp} />
            ))
          )}
        </Grid>
      </div>
    </Layout>
  )
}

export default UsernamePage
