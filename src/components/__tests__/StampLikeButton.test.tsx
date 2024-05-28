import { render, screen } from '../../__tests__/test-utils'
import { StampLikeButton } from '../StampLikeButton'

describe('LikeButton', () => {
  it('renders provided props', () => {
    render(<StampLikeButton id={'12'} initialLikes={1} />)

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
  })
})
