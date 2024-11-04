import { act, render, screen, userEvent } from '../../../__tests__/test-utils'
import { UserDropdownButton } from '../UserDropdownButton'

describe('UserDropdownButton', () => {
  it('renders login button for unauthenticated users', () => {
    render(<UserDropdownButton />)
    expect(screen.getByRole('link', { name: 'Add Stamp' })).toBeInTheDocument()
  })
  it('user-menu prompts to set username for authenticated users without username set', async () => {
    const user = { biography: null, id: '1', username: null, usernameURL: null }
    render(<UserDropdownButton />, { user })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await act(async () => await userEvent.click(button))
    expect(
      screen.getByRole('menuitem', { name: 'Please set username!' }),
    ).toHaveAttribute('href', '/1/settings')
    expect(
      screen.getByRole('menuitem', { name: 'My Account' }),
    ).toHaveAttribute('href', '/1/settings')
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/1',
    )
    expect(
      screen.getByRole('menuitem', { name: 'Add new stamp' }),
    ).toHaveAttribute('href', '/stamp/create')
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument()
  })
  it('user-menu provides right href for authenticated user with username set', async () => {
    const user = {
      biography: null,
      id: '1',
      username: 'stampCreator',
      usernameURL: 'stampcreator',
    }
    render(<UserDropdownButton />, { user })

    await act(async () => await userEvent.click(screen.getByRole('button')))
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/stampcreator',
    )
  })
})
