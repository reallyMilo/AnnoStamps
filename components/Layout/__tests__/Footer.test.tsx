//FIXME: jest-dom import
import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import Footer from '../Footer'

describe('Footer', () => {
  it('renders and has discord and github links', () => {
    render(<Footer />)

    expect(screen.getByTestId('github')).toHaveAttribute(
      'href',
      'https://github.com/reallyMilo/AnnoStamps'
    )
    expect(screen.getByTestId('discord')).toHaveAttribute(
      'href',
      'https://discord.gg/73hfP54qXe'
    )
  })
})
