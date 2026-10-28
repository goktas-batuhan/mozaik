import { render, screen } from '@testing-library/react'
import { TestimonialFeatured } from './testimonial-featured'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialFeatured', () => {
  it('shows the featured quote and its author', () => {
    render(<TestimonialFeatured featured={items[0]!} />)
    expect(screen.getByRole('region', { name: 'Featured testimonial' })).toBeInTheDocument()
    expect(screen.getByText('Quote A')).toBeInTheDocument()
    expect(screen.getByText('Designer, Fernhill')).toBeInTheDocument()
  })

  it('renders no supporting list without items', () => {
    render(<TestimonialFeatured featured={items[0]!} />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('lists the supporting quotes underneath', () => {
    render(<TestimonialFeatured featured={items[0]!} items={items.slice(1)} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Quote C')).toBeInTheDocument()
  })

  it('shows the eyebrow only when given', () => {
    const { rerender } = render(<TestimonialFeatured featured={items[0]!} />)
    expect(screen.queryByText('Case study')).not.toBeInTheDocument()
    rerender(<TestimonialFeatured featured={items[0]!} eyebrow="Case study" />)
    expect(screen.getByText('Case study')).toBeInTheDocument()
  })
})
