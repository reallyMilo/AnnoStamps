import { render, screen } from '../../__tests__/test-utils'
import LikeButton from '../LikeButton'

describe('LikeButton', () => {
  it('renders provided props', () => {
    render(<LikeButton id={'12'} initialLikes={1} />)

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
  })
})
