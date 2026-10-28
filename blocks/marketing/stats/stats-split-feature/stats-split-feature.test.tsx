import { render, screen } from '@testing-library/react'
import { StatsSplitFeature } from './stats-split-feature'

const stats = [
  { value: 8, suffix: 'K', label: 'Teams', description: 'Worldwide' },
  { value: 1.2, suffix: 'B', decimalPlaces: 1, label: 'Events' },
]

describe('StatsSplitFeature', () => {
  it('labels the section with its headline and shows the eyebrow', () => {
    render(<StatsSplitFeature title="Scale" eyebrow="Trusted" stats={stats} />)
    expect(screen.getByRole('region', { name: 'Scale' })).toBeInTheDocument()
    expect(screen.getByText('Trusted')).toBeInTheDocument()
  })

  it('renders the call to action as a link', () => {
    render(<StatsSplitFeature title="Scale" action={{ label: 'Read more', href: '/stories' }} stats={stats} />)
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/stories')
  })

  it('omits the link when there is no action', () => {
    render(<StatsSplitFeature title="Scale" stats={stats} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('exposes each stat as a labelled term with its final value', () => {
    render(<StatsSplitFeature title="Scale" stats={stats} />)
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['Teams', 'Events'])
    expect(screen.getByText('1.2', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByText('Worldwide')).toBeInTheDocument()
  })
})
