import { render, screen, within } from '@testing-library/react'
import { FeaturesIconGrid } from './features-icon-grid'

const features = [
  { title: 'Fast', description: 'Quick.', icon: <svg data-testid="icon" /> },
  { title: 'Accessible', description: 'Usable.' },
  { title: 'Typed', description: 'Safe.' },
]

describe('FeaturesIconGrid', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesIconGrid title="Why us" features={features} />)
    expect(screen.getByRole('region', { name: 'Why us' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Why us' })).toBeInTheDocument()
  })

  it('renders one list item per feature with its title and copy', () => {
    render(<FeaturesIconGrid title="Why us" features={features} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(items[1]).getByRole('heading', { level: 3, name: 'Accessible' })).toBeInTheDocument()
    expect(within(items[1]).getByText('Usable.')).toBeInTheDocument()
  })

  it('shows icons only for features that have one, hidden from assistive tech', () => {
    render(<FeaturesIconGrid title="Why us" features={features} />)
    expect(screen.getAllByTestId('icon')).toHaveLength(1)
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies the column count and the headline element', () => {
    render(<FeaturesIconGrid title="Why us" features={features} columns={4} titleAs="h3" />)
    expect(screen.getByRole('list')).toHaveClass('@4xl:grid-cols-4')
    expect(screen.getByRole('heading', { level: 3, name: 'Why us' })).toBeInTheDocument()
  })

  it('renders content fully visible when disabled', () => {
    render(<FeaturesIconGrid title="Static" features={features} disabled />)
    const item = screen.getAllByRole('listitem')[0]
    expect(item.style.opacity).not.toBe('0')
  })
})
