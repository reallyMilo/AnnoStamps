import { usePathname } from 'next/navigation'
import { type Mock } from 'vitest'

import { act, render, screen, userEvent } from '../../../__tests__/test-utils'
import { UserDropdownButton } from '../UserDropdownButton'

describe('UserDropdownButton', () => {
  it('renders login button for unauthenticated users', () => {
    render(<UserDropdownButton />)
    expect(screen.getByRole('link', { name: 'Add Stamp' })).toBeInTheDocument()
  })
  it('user-menu has triangle alert to set username for authenticated users without username set', async () => {
    const user = { biography: null, id: '1', username: null, usernameURL: null }
    render(<UserDropdownButton />, { user })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await act(async () => await userEvent.click(button))
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
  it('user-menu nav items have correct hrefs depending on game version', async () => {
    ;(usePathname as Mock).mockReturnValue('1800') // eslint-disable-line no-extra-semi
    const user = {
      biography: null,
      id: '1',
      username: 'stampCreator',
      usernameURL: 'stampcreator',
    }
    render(<UserDropdownButton />, { user })

    const button = screen.getByRole('button')
    await act(async () => await userEvent.click(button))
    expect(
      screen.getByRole('menuitem', { name: 'My Account' }),
    ).toHaveAttribute('href', '/stampcreator/settings')
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/stampcreator/1800',
    )
    expect(
      screen.getByRole('menuitem', { name: 'Add new stamp' }),
    ).toHaveAttribute('href', '/1800/stamp/create')
  })
})
