import { act, render, screen, userEvent } from '../../../__tests__/test-utils'
import UserButton from '../UserButton'

describe('UserButton', () => {
  it('renders for unauthenticated user', () => {
    render(<UserButton />)

    expect(screen.getByText('Add Stamp')).toBeInTheDocument()
  })

  it('user-menu prompts to set username for authenticated users without username set', async () => {
    render(<UserButton />, {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { id: '1', username: null, usernameURL: null, biography: null },
    })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await act(async () => await userEvent.click(button))
    expect(
      screen.getByRole('link', { name: 'Please set username!' })
    ).toHaveAttribute('href', '/user/account')
    expect(screen.getByRole('link', { name: 'My Account' })).toHaveAttribute(
      'href',
      '/user/account'
    )
    expect(screen.getByRole('link', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/user/account'
    )
    expect(screen.getByRole('link', { name: 'Add new stamp' })).toHaveAttribute(
      'href',
      '/user/create'
    )
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
  })
  it('user-menu provides right href for authenticated user with username set', async () => {
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
    expect(screen.getByRole('link', { name: 'stampCreator' })).toHaveAttribute(
      'href',
      '/stampcreator'
    )
    expect(screen.getByRole('link', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/stampcreator'
    )
  })
})
