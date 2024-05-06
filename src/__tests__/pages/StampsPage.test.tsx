import type { StampWithRelations } from '@/lib/prisma/queries'
import StampsPage from '@/pages/stamps'

import { act, fireEvent, render, screen, userEvent } from '../test-utils'

const stamps = [
  {
    id: 'clmsefb5m00ujk9xxenynap1z',
    createdAt: 1695253939,
    changedAt: 1695253939,
    user: {
      username: 'user100',
    },
    images: [
      {
        id: 'ythkadyhl34yt4dolibfgf9l',
        originalUrl:
          'https://placehold.co/2000x2000.png?text=Original2\\nythkadyhl34yt4dolibfgf9l',
        thumbnailUrl:
          'https://placehold.co/250x250.png?text=Thumbnail2\\nythkadyhl34yt4dolibfgf9l',
        smallUrl:
          'https://placehold.co/500x281.png?text=Small2\\nythkadyhl34yt4dolibfgf9l',
        mediumUrl:
          'https://placehold.co/750x421.png?text=Medium2\\nythkadyhl34yt4dolibfgf9l',
        largeUrl:
          'https://placehold.co/1024x576.png?text=Large2\\nythkadyhl34yt4dolibfgf9l',
        createdAt: 1713225895,
        updatedAt: 1713225895,
        stampId: 'clmsefb5m00ujk9xxenynap1z',
      },
    ],
  },
] as unknown as StampWithRelations[]

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

describe('Stamps Page', () => {
  it('render StampsPage with filter and without stamps', () => {
    render(<StampsPage count={0} stamps={[]} pageNumber={1} />)

    expect(screen.getByText('category')).toBeInTheDocument()
    expect(screen.getByText('No stamps found.')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('displays pagination and stamps on StampsPage', () => {
    render(<StampsPage count={22} stamps={stamps} pageNumber={1} />)

    expect(screen.getByText('user100')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays filter icon on mobile and opens on click', async () => {
    render(<StampsPage count={22} stamps={stamps} pageNumber={1} />)
    window.innerWidth = 500
    fireEvent(window, new Event('resize'))

    expect(screen.getByTestId('mobile-filter-button')).toBeVisible()
    await act(
      async () =>
        await userEvent.click(screen.getByTestId('mobile-filter-button'))
    )

    expect(screen.getByRole('heading'), 'Filters').toBeVisible()
    expect(screen.getByTestId('mobile-close-filter-button')).toBeVisible()
  })
})
