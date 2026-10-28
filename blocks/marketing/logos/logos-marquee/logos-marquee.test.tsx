import { render, screen } from '@testing-library/react'
import { LogosMarquee } from './logos-marquee'

const logos = [
  { name: 'Lumen', logo: <svg data-testid="lumen" /> },
  { name: 'Orbit', logo: <svg data-testid="orbit" /> },
]

describe('LogosMarquee', () => {
  it('renders the heading and the logos', () => {
    render(<LogosMarquee title="Our customers" logos={logos} />)
    expect(screen.getByRole('heading', { name: 'Our customers' })).toBeInTheDocument()
    expect(screen.getAllByTestId('lumen').length).toBeGreaterThan(0)
  })

  it('names every logo for screen readers', () => {
    render(<LogosMarquee logos={logos} />)
    expect(screen.getAllByText('Orbit')[0]).toHaveClass('sr-only')
  })

  it('hides the looped copies from assistive tech', () => {
    const { container } = render(<LogosMarquee logos={logos} />)
    const hidden = container.querySelectorAll('[aria-hidden="true"]')
    const copies = screen.getAllByText('Lumen').length
    expect(copies).toBeGreaterThan(1)
    expect(hidden).toHaveLength(copies - 1)
  })

  it('omits the heading when title is null', () => {
    render(<LogosMarquee title={null} logos={logos} />)
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('still renders every logo when disabled', () => {
    render(<LogosMarquee logos={logos} disabled />)
    expect(screen.getAllByTestId('orbit').length).toBeGreaterThan(0)
  })
})
