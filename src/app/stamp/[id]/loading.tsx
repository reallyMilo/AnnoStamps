import { Container, Heading } from '@/components/ui'

const StampPageLoading = () => {
  return (
    <Container className="max-w-5xl animate-pulse space-y-6 px-0">
      {/* Image */}
      <div className="min-h-[576px] w-full bg-gray-500"></div>
      <div className="space-y-6 px-2 text-midnight sm:px-0 dark:text-white">
        <div className="min-h-8 w-1/3 bg-gray-500"></div>
        <div className="min-h-8 bg-gray-500"></div>
        <div className="min-h-40 bg-gray-500"></div>
        <div>
          <Heading level={2}>Comments</Heading>
        </div>
      </div>
    </Container>
  )
}

export default StampPageLoading
