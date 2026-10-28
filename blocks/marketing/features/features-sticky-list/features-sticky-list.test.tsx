import { render, screen } from '@testing-library/react'
import { FeaturesStickyList } from './features-sticky-list'

const features = [
  { title: 'One', description: 'First.', tag: 'Insight', visual: <i data-testid="v1" /> },
  { title: 'Two', description: 'Second.' },
]

describe('FeaturesStickyList', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesStickyList title="Powerful" features={features} />)
    expect(screen.getByRole('region', { name: 'Powerful' })).toBeInTheDocument()
  })

  it('renders a card per feature with heading and copy', () => {
    render(<FeaturesStickyList title="Powerful" features={features} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 3, name: 'Two' })).toBeInTheDocument()
    expect(screen.getByText('First.')).toBeInTheDocument()
  })

  it('renders optional tag and visual only where given', () => {
    render(<FeaturesStickyList title="Powerful" features={features} />)
    expect(screen.getByText('Insight')).toBeInTheDocument()
    expect(screen.getAllByTestId('v1')).toHaveLength(1)
  })

  it('pins the headline column on wide containers', () => {
    render(<FeaturesStickyList title="Powerful" features={features} />)
    expect(screen.getByRole('heading', { level: 2 }).parentElement?.parentElement).toHaveClass('@3xl:sticky')
  })

  it('renders the action as a link', () => {
    render(<FeaturesStickyList title="Powerful" features={features} action={{ label: 'More', href: '/more' }} />)
    expect(screen.getByRole('link', { name: 'More' })).toHaveAttribute('href', '/more')
  })
})
