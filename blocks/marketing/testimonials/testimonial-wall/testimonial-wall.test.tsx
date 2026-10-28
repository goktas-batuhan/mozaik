import { render, screen } from '@testing-library/react'
import { TestimonialWall } from './testimonial-wall'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialWall', () => {
  it('labels the section with its headline', () => {
    render(<TestimonialWall title="Loved" items={items} />)
    expect(screen.getByRole('region', { name: 'Loved' })).toBeInTheDocument()
  })

  it('renders every quote with its author', () => {
    render(<TestimonialWall items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Quote B')).toBeInTheDocument()
    expect(screen.getByText('Mara Ellison')).toBeInTheDocument()
    expect(screen.getByText('Designer, Fernhill')).toBeInTheDocument()
  })

  it('draws initials as the avatar and hides them from assistive tech', () => {
    render(<TestimonialWall items={items} />)
    expect(screen.getByText('ME')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('PR')).toBeInTheDocument()
  })

  it('announces the rating in words and skips it when not set', () => {
    render(<TestimonialWall items={[{ ...items[0]!, rating: 4 }, items[1]!]} />)
    expect(screen.getByText('4 out of 5 stars')).toBeInTheDocument()
    expect(screen.getAllByText(/out of 5 stars/)).toHaveLength(1)
  })
})
