import { act, render, screen, userEvent } from '../../../__tests__/test-utils'
import { UserButton } from '../UserButton'

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
      screen.getByRole('menuitem', { name: 'Please set username!' })
    ).toHaveAttribute('href', '/1/settings')
    expect(
      screen.getByRole('menuitem', { name: 'My Account' })
    ).toHaveAttribute('href', '/1/settings')
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/1'
    )
    expect(
      screen.getByRole('menuitem', { name: 'Add new stamp' })
    ).toHaveAttribute('href', '/stamp/create')
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument()
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
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/stampcreator'
    )
  })
})
