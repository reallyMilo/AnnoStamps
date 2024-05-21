import { render, screen } from '@/__tests__/test-utils'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders with provided props', () => {
    render(<Pagination count={3000} page={1} />)

    expect(screen.getByText('3000')).toBeInTheDocument()
    expect(screen.getByText('19')).toBeInTheDocument()
  })
})
