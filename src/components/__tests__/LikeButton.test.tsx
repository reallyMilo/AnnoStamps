import { StampWithRelations } from '@/lib/prisma/queries'

import { render, screen } from '../../__tests__/test-utils'
import LikeButton from '../LikeButton'

const likedBy = [{ id: '1' }] as StampWithRelations['likedBy']

describe('LikeButton', () => {
  it('renders provided props', () => {
    render(<LikeButton id={'12'} likedBy={likedBy} />)

    expect(screen.getByText('1')).toBeInTheDocument()
  })
  it('displays no likes', () => {
    render(<LikeButton id={'12'} likedBy={[]} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
