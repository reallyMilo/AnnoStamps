import { render, screen } from '@/__tests__/test-utils'

import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders when below max size', () => {
    render(<Pagination count={100} page={1} />)

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('1')
    expect(screen.getAllByRole('link', { name: /Page \d+/ })).toHaveLength(5)
    expect(screen.getByRole('link', { name: 'Next page' })).toBeInTheDocument()
  })
  it('renders when exceeds max size', () => {
    render(<Pagination count={500} page={1} />)

    expect(screen.getAllByRole('link', { name: /Page \d+/ })).toHaveLength(12)
    expect(screen.getByTestId('pagination-gap')).toBeInTheDocument()
  })
  it('renders two gap indicators for middle page with correct page range', () => {
    const currentPage = 25
    render(<Pagination count={1000} page={currentPage} />)

    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
      '25'
    )
    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(11)

    expect(allLinks[1]).toHaveTextContent((currentPage - 4).toString())
    expect(allLinks[9]).toHaveTextContent((currentPage + 4).toString())

    expect(screen.getAllByTestId('pagination-gap')).toHaveLength(2)
  })
})
