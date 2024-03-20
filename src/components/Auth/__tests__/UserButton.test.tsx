import { act, render, screen, userEvent } from '../../../__tests__/test-utils'
import UserButton from '../UserButton'

describe('UserButton', () => {
  it('renders for unauthenticated user', () => {
    render(<UserButton />)

    expect(screen.getByText('Add Stamp')).toBeInTheDocument()
  })

  it('user-menu for authenticated users with all menu items', async () => {
    render(<UserButton />, {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { id: '1', username: null, usernameURL: null, biography: null },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await act(async () => await userEvent.click(button))
    expect(screen.getByText('Set username!')).toBeInTheDocument()
    expect(screen.getByText('My Account')).toBeInTheDocument()
    expect(screen.getByText('My stamps')).toBeInTheDocument()
    expect(screen.getByText('Add new stamp')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
  it('displays username', async () => {
    render(<UserButton />, {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: {
        id: '1',
        username: 'stampCreator',
        usernameURL: 'stampcreator',
        biography: null,
      },
    })

    await act(async () => await userEvent.click(screen.getByRole('button')))
    expect(screen.getByText('stampCreator')).toBeInTheDocument()
  })
})
