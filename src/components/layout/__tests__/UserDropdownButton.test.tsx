import { render, screen, userEvent } from '../../../__tests__/test-utils'
import { UserDropdownButton } from '../UserDropdownButton'

const session = {
  userId: '1',
  user: {
    biography: null,
    username: null,
    usernameURL: null,
    email: 'none',
    id: '1',
    emailVerified: null,
    notifications: [],
  },
  expires: '',
  sessionToken: 'asd',
}
describe('UserDropdownButton', () => {
  it('renders login button for unauthenticated users', () => {
    render(<UserDropdownButton />)
    expect(screen.getByRole('link', { name: 'Add Stamp' })).toBeInTheDocument()
  })
  it('user-menu prompts to set username for authenticated users without username set', async () => {
    render(<UserDropdownButton />, session)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await userEvent.click(button)
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
      email: '',
      emailVerified: null,
      notifications: [],
    }
    render(<UserDropdownButton />, { ...session, user })

    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/stampcreator',
    )
  })
})
