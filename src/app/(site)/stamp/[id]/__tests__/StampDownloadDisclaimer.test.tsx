import { fireEvent, render, screen } from '@/__tests__/test-utils'

import { StampDownloadDisclaimer } from '../StampDownloadDisclaimer'

describe('StampDownloadDisclaimer', () => {
  const now = new Date('2025-09-19T12:00:00Z')

  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('renders children when changedAt is older than 7 days', () => {
    const oldDate = new Date('2025-09-01T12:00:00Z')
    render(
      <StampDownloadDisclaimer changedAt={oldDate}>
        <p>Child content</p>
      </StampDownloadDisclaimer>,
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders modal warning when changedAt is within the last 7 days', async () => {
    const recentDate = new Date('2025-09-15T12:00:00Z')
    render(
      <StampDownloadDisclaimer changedAt={recentDate}>
        <button>Download</button>
      </StampDownloadDisclaimer>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Download' }))

    expect(
      screen.getByText(/This stamp has been recently uploaded or changed!/i),
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /Discord/i })).toHaveAttribute(
      'href',
      'https://discord.gg/73hfP54qXe',
    )

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
  })

  it('treats exactly 7 days ago as not within the last week', () => {
    const exactDate = new Date('2025-09-12T12:00:00Z')
    render(
      <StampDownloadDisclaimer changedAt={exactDate}>
        <p>Child content</p>
      </StampDownloadDisclaimer>,
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })
})
