import { render, screen, within } from '@testing-library/react'
import { FeaturesNumbered } from './features-numbered'

const features = [
  { title: 'Clear', description: 'Simple.' },
  { title: 'Calm', description: 'Quiet.' },
  { title: 'Open', description: 'Exportable.' },
]

describe('FeaturesNumbered', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesNumbered title="Principles" features={features} />)
    expect(screen.getByRole('region', { name: 'Principles' })).toBeInTheDocument()
  })

  it('renders an ordered list in the given order', () => {
    render(<FeaturesNumbered title="Principles" features={features} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items.map((li) => within(li).getByRole('heading', { level: 3 }).textContent)).toEqual(['Clear', 'Calm', 'Open'])
  })

  it('shows zero-padded numerals that assistive tech skips', () => {
    render(<FeaturesNumbered title="Principles" features={features} />)
    const numeral = screen.getByText('02')
    expect(numeral).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('03')).toBeInTheDocument()
  })

  it('sizes the grid to the number of features', () => {
    const { rerender } = render(<FeaturesNumbered title="Principles" features={features} />)
    expect(screen.getByRole('list')).toHaveClass('@2xl:grid-cols-3')
    rerender(<FeaturesNumbered title="Principles" features={features.slice(0, 2)} />)
    expect(screen.getByRole('list')).toHaveClass('@2xl:grid-cols-2')
  })
})
