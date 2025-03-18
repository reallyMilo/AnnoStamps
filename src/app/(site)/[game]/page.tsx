import { Text } from '@/components/ui'

const PreviousVersionHomePage = ({ params }: { params: { game: string } }) => {
  return <Text>Home page for: {params.game}</Text>
}

export default PreviousVersionHomePage
