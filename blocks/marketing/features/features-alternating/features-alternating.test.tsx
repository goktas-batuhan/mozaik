import { render, screen } from '@testing-library/react'
import { FeaturesAlternating } from './features-alternating'

const features = [
  { title: 'First', description: 'One.', media: <img alt="Shot one" />, link: { label: 'Learn more', href: '/one' } },
  { title: 'Second', description: 'Two.', media: <img alt="Shot two" /> },
  { title: 'Third', description: 'Three.', media: <img alt="Shot three" /> },
]

describe('FeaturesAlternating', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesAlternating title="Why us" features={features} />)
    expect(screen.getByRole('region', { name: 'Why us' })).toBeInTheDocument()
  })

  it('renders each row with a heading, copy and media', () => {
    render(<FeaturesAlternating title="Why us" features={features} />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['First', 'Second', 'Third'])
    expect(screen.getByAltText('Shot two')).toBeInTheDocument()
    expect(screen.getByText('Three.')).toBeInTheDocument()
  })

  it('renders a link only for rows that define one', () => {
    render(<FeaturesAlternating title="Why us" features={features} />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '/one')
  })

  it('swaps the copy side on every other row', () => {
    render(<FeaturesAlternating title="Why us" features={features} />)
    const copy = (name: string) => screen.getByRole('heading', { name }).parentElement!
    expect(copy('First')).not.toHaveClass('@3xl:order-2')
    expect(copy('Second')).toHaveClass('@3xl:order-2')
    expect(copy('Third')).not.toHaveClass('@3xl:order-2')
  })
})
