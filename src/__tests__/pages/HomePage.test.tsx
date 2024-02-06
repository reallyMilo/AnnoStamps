import { stampMock } from '@/__mocks__/data'
import HomePage from '@/pages'

import { render, screen } from '../test-utils'

const stamps = stampMock
describe('Home Page', () => {
  it('render HomePage with filter and without stamps', () => {
    render(<HomePage count={0} stamps={[]} pageNumber={1} />)

    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByText('No stamps found.')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('displays pagination and stamps on HomePage', () => {
    render(<HomePage count={22} stamps={stamps} pageNumber={1} />)

    expect(screen.getByText('user100')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
