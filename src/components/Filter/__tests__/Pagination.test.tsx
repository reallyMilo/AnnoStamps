import { render, screen } from '@/__tests__/test-utils'

import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders when below max size', () => {
    render(<Pagination count={100} page={1} />)

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('1')
    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(5)
    expect(allLinks[0]).toHaveTextContent(/^1$/)
    expect(allLinks[4]).toHaveTextContent(/^5$/)
    expect(screen.getByRole('link', { name: 'Next page' })).toBeInTheDocument()
  })
  it('renders when exceeds max size', () => {
    render(<Pagination count={500} page={1} />)

    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(12)
    expect(allLinks[10]).toHaveTextContent(/^11$/)
    expect(allLinks[11]).toHaveTextContent(/^25$/)
    expect(screen.getByTestId('pagination-gap')).toBeInTheDocument()
  })
  it('renders two gap indicators for middle page with correct page range', () => {
    const currentPage = 25
    render(<Pagination count={1000} page={currentPage} />)

    expect(
      screen.getByRole('link', { name: 'Previous page' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
      '25'
    )
    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(11)
    expect(allLinks[0]).toHaveTextContent(/^1$/)
    expect(allLinks[1]).toHaveTextContent(
      new RegExp(`^${(currentPage - 4).toString()}$`)
    )
    expect(allLinks[9]).toHaveTextContent(
      new RegExp(`^${(currentPage + 4).toString()}$`)
    )
    expect(allLinks[10]).toHaveTextContent(/^50$/)
    expect(screen.getAllByTestId('pagination-gap')).toHaveLength(2)
  })
  it('renders full left side pagination when insufficient pages to collapse', () => {
    render(<Pagination count={1000} page={8} />)

    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(12)
    expect(allLinks[1]).toHaveTextContent(/^2$/)
    expect(allLinks[10]).toHaveTextContent(/^11$/)
    expect(screen.getByTestId('pagination-gap')).toBeInTheDocument()
  })
  it('renders full right side pagination when insufficient pages to collapse', () => {
    render(<Pagination count={1001} page={43} />)

    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(12)
    expect(allLinks[1]).toHaveTextContent(/^41$/)
    expect(allLinks[10]).toHaveTextContent(/^50$/)
    expect(screen.getByTestId('pagination-gap')).toBeInTheDocument()
  })
  it('disables next button on last page', () => {
    render(<Pagination count={1001} page={51} />)

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })
  it('renders right gap correctly with small total page count', () => {
    render(<Pagination count={280} page={8} />)

    const allLinks = screen.getAllByRole('link', { name: /Page \d+/ })
    expect(allLinks).toHaveLength(12)
    expect(allLinks[1]).toHaveTextContent(/^2$/)
    expect(allLinks[10]).toHaveTextContent(/^11$/)
    expect(allLinks[11]).toHaveTextContent(/^14$/)
    expect(screen.getByTestId('pagination-gap')).toBeInTheDocument()
  })
})
