import { stampMock } from '@/__mocks__/data'
import { StampWithRelations } from '@/lib/prisma/queries'
import StampPage from '@/pages/stamp/[id]'

import { render as renderRTL, screen, userEvent } from '../../test-utils'

const stamp = stampMock[0]

const render = (props?: Partial<StampWithRelations>) => ({
  ...renderRTL(<StampPage stamp={{ ...stamp, ...props }} />),
  user: userEvent.setup(),
})

describe('Stamp Page', () => {
  it('renders with all provided fields', () => {
    render()

    expect(screen.getByText('Stamp-Calamari-999')).toBeInTheDocument()
    expect(screen.getByText('My greatest Stamp')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('new world')).toBeInTheDocument()
    expect(screen.getByText('calamari')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('Collection')).toBeInTheDocument()
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
  it('does not display false props', () => {
    render({
      collection: false,
      modded: false,
    })
    expect(screen.queryByText('mods')).not.toBeInTheDocument()
    expect(screen.queryByText('collection')).not.toBeInTheDocument()
  })
})
