import { render, screen } from '../../../__tests__/test-utils'
import UserMenu from '../UserMenu'

describe('UserMenu', () => {
  it('renders and has all links', () => {
    render(<UserMenu />)

    expect(screen.getByText('Add Stamp')).toBeInTheDocument()
  })

  it('displays user-menu for authenticated users', () => {
    render(<UserMenu />, {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { id: '1' },
    })

    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
  })
})
