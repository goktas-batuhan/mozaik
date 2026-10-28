import { render, screen } from '@testing-library/react'
import { FeaturesBento } from './features-bento'

const features = [
  { title: 'Analytics', description: 'Charts.', colSpan: 2 as const, rowSpan: 2 as const, visual: <i data-testid="visual" /> },
  { title: 'Docs', description: 'Guides.', href: '/docs' },
  { title: 'Edge', description: 'Fast.' },
]

describe('FeaturesBento', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesBento title="Everything" features={features} />)
    expect(screen.getByRole('region', { name: 'Everything' })).toBeInTheDocument()
  })

  it('renders every tile as a heading with its description', () => {
    render(<FeaturesBento title="Everything" features={features} />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Analytics', 'Docs', 'Edge'])
    expect(screen.getByText('Guides.')).toBeInTheDocument()
  })

  it('turns a tile with an href into a link', () => {
    render(<FeaturesBento title="Everything" features={features} />)
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs')
    expect(screen.queryByRole('link', { name: 'Edge' })).not.toBeInTheDocument()
  })

  it('keeps tile artwork out of the accessibility tree', () => {
    render(<FeaturesBento title="Everything" features={features} />)
    expect(screen.getByTestId('visual').closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('passes the row height to the grid', () => {
    const { container } = render(<FeaturesBento title="Everything" features={features} rowHeight="9rem" />)
    expect(container.querySelector('[style*="--bento-row: 9rem"]')).not.toBeNull()
  })
})
