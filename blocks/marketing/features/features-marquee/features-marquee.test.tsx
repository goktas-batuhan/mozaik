import { render, screen } from '@testing-library/react'
import { FeaturesMarquee } from './features-marquee'

const features = [
  { title: 'One', description: 'First.' },
  { title: 'Two', description: 'Second.', icon: <svg data-testid="icon" /> },
  { title: 'Three' },
  { title: 'Four' },
]

describe('FeaturesMarquee', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesMarquee title="Details" features={features} />)
    expect(screen.getByRole('region', { name: 'Details' })).toBeInTheDocument()
  })

  it('splits the features over the requested number of rows', () => {
    render(<FeaturesMarquee title="Details" features={features} rows={2} disabled />)
    expect(screen.getAllByRole('list')).toHaveLength(2)
  })

  it('keeps every feature readable once, even though the loop repeats', () => {
    render(<FeaturesMarquee title="Details" features={features} rows={1} />)
    // Copies after the first are hidden from assistive tech by Marquee.
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toContain('OneFirst.')
  })

  it('hides decorative icons', () => {
    render(<FeaturesMarquee title="Details" features={features} rows={1} disabled />)
    expect(screen.getAllByTestId('icon')[0].parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
