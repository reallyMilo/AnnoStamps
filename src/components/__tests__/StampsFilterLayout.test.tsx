import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type Mock, vi } from 'vitest'

import { fireEvent, render, screen, userEvent } from '@/__tests__/test-utils'

import { StampsFilterLayout } from '../StampsFilterLayout'

const mockPush = vi.fn()
const mockReplace = vi.fn()

const renderFilterLayout = () =>
  render(
    <StampsFilterLayout
      checkboxFilterOptions={[
        {
          id: 'category',
          options: ['general', 'production'],
        },
      ]}
    >
      <div>Stamp list</div>
    </StampsFilterLayout>,
  )

describe('StampsFilterLayout', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockReplace.mockReset()
    ;(usePathname as Mock).mockReturnValue('/stamps')
    ;(useRouter as Mock).mockReturnValue({
      prefetch: vi.fn(),
      push: mockPush,
      replace: mockReplace,
    })
  })

  it('resets to page 1 when adding a filter', async () => {
    ;(useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('game=117&category=general&page=2'),
    )

    renderFilterLayout()

    await userEvent.click(screen.getByRole('checkbox', { name: 'production' }))

    expect(mockPush).toHaveBeenCalledWith(
      '/stamps?game=117&category=general&category=production&page=1',
    )
  })

  it('resets to page 1 when removing a filter', async () => {
    ;(useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('game=117&category=production&page=2'),
    )

    renderFilterLayout()

    await userEvent.click(screen.getByRole('checkbox', { name: 'production' }))

    expect(mockPush).toHaveBeenCalledWith('/stamps?game=117&page=1')
  })

  it('resets to page 1 when changing sort', async () => {
    ;(useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('game=117&sort=downloads&page=2'),
    )

    renderFilterLayout()

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Sort' }),
      'newest',
    )

    expect(mockPush).toHaveBeenCalledWith('/stamps?game=117&sort=newest&page=1')
  })

  it('resets to page 1 when submitting a search', async () => {
    ;(useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('game=117&page=3'),
    )

    renderFilterLayout()

    await userEvent.type(screen.getByLabelText('Search'), 'harbor')
    fireEvent.submit(screen.getByLabelText('Search').closest('form')!)

    expect(mockPush).toHaveBeenCalledWith(
      '/stamps?game=117&search=harbor&page=1',
    )
  })

  it('clears search and resets to page 1', async () => {
    ;(useSearchParams as Mock).mockReturnValue(
      new URLSearchParams('game=117&search=harbor&page=3'),
    )

    renderFilterLayout()

    const searchInput = screen.getByLabelText('Search')
    await userEvent.clear(searchInput)
    fireEvent.submit(searchInput.closest('form')!)

    expect(mockPush).toHaveBeenCalledWith('/stamps?game=117&page=1')
  })
})
