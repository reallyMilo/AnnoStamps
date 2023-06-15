import { StampWithLikes } from 'types'

import Card from './Card'

const Grid = ({ stamps }: { stamps: Partial<StampWithLikes>[] }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stamps.map((stamp) => (
        <Card key={stamp.id} {...stamp} />
      ))}
    </div>
  )
}
export default Grid
