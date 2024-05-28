import type { InferGetStaticPropsType } from 'next'

import { StampCard } from '@/components/StampCard'
import { Container, Grid } from '@/components/ui'

import { UserBanner } from '../../../components/UserBanner'
import { type getStaticProps } from './users-view.getStaticProps'

const UserPublicPage = ({
  user,
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (user.listedStamps.length === 0) {
    return (
      <Container>
        <UserBanner user={user} stats={stats} />
        <p>User has no stamps</p>
      </Container>
    )
  }

  return (
    <Container>
      <UserBanner user={user} stats={stats} />
      <Grid>
        {user.listedStamps.map((stamp) => (
          <StampCard key={stamp.id} user={user} {...stamp} />
        ))}
      </Grid>
    </Container>
  )
}

export default UserPublicPage
