import { StampCardSkeleton } from '@/components/StampCard'
import { Container, Grid } from '@/components/ui'
const UserPageLoading = () => {
  return (
    <Container>
      <div className="mb-4 flex animate-pulse flex-col gap-y-2 border-b-2 pb-10">
        <div className="flex min-h-8 w-1/3 space-x-4 bg-gray-500"></div>
        <div className="min-h-10 w-1/2 bg-gray-500"></div>
      </div>
      <Grid>
        {[1, 2].map((i) => (
          <StampCardSkeleton key={`stamp-card-skeleton-${i}`} />
        ))}
      </Grid>
    </Container>
  )
}
export default UserPageLoading
