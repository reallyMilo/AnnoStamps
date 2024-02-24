import Container from '@/components/ui/Container'
import Grid from '@/components/ui/Grid'

const Loading = () => {
  return (
    <Container className="animate-pulse">
      <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
        <div className="flex space-x-4 ">
          <h1 className="text-3xl"></h1>
          <span className="self-end"> Downloads</span>
          <span className="self-end"> Likes</span>
        </div>
        <p className="text-sm"></p>
      </div>

      <Grid>
        <div className="rounded-lg bg-white shadow-md">
          <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-200"></div>
          <div className="flex h-48 flex-col flex-nowrap gap-y-2 border bg-white p-4"></div>
        </div>
      </Grid>
    </Container>
  )
}

export default Loading
