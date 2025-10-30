import { usePathname } from 'next/navigation'
import { type Mock } from 'vitest'

import { useSession } from '@/lib/auth-client'

import { act, render, screen, userEvent } from '../../../__tests__/test-utils'
import { UserDropdownButton } from '../UserDropdownButton'

describe('UserDropdownButton', () => {
  it('renders login button for unauthenticated users', () => {
    ;(useSession as Mock).mockReturnValueOnce({ data: null }) // eslint-disable-line no-extra-semi
    render(<UserDropdownButton />)
    expect(screen.getByRole('link', { name: 'Add Stamp' })).toBeInTheDocument()
  })
  it('user-menu provides right href for authenticated user with username set', async () => {
    const session = {
      user: {
        biography: null,
        id: '1',
        username: 'stampCreator',
        usernameURL: 'stampcreator',
      },
      userId: '1',
    }
    ;(useSession as Mock).mockReturnValueOnce({
      data: session,
      isPending: false,
    })
    render(<UserDropdownButton />)

    await act(async () => await userEvent.click(screen.getByRole('button')))
    expect(screen.getByRole('menuitem', { name: 'My stamps' })).toHaveAttribute(
      'href',
      '/stampcreator',
    )
  })
  it('user-menu nav items have correct hrefs depending on game version', async () => {
    const session = {
      user: {
        biography: null,
        id: '1',
        username: 'stampCreator',
        usernameURL: 'stampcreator',
      },
      userId: '1',
    }
    ;(useSession as Mock).mockReturnValueOnce({
      data: session,
      isPending: false,
    })
    ;(usePathname as Mock).mockReturnValue('1800')
    render(<UserDropdownButton />)

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
