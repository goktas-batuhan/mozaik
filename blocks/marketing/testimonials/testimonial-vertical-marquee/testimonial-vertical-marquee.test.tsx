import { render, screen } from '@testing-library/react'
import { TestimonialVerticalMarquee } from './testimonial-vertical-marquee'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialVerticalMarquee', () => {
  it('labels the section with its headline', () => {
    render(<TestimonialVerticalMarquee title="Users say" items={items} />)
    expect(screen.getByRole('region', { name: 'Users say' })).toBeInTheDocument()
  })

  it('splits the testimonials into the requested columns', () => {
    const { container } = render(<TestimonialVerticalMarquee items={items} columns={3} />)
    expect(container.querySelectorAll('.h-full.min-w-0')).toHaveLength(3)
  })

  it('shows only one column when asked for one', () => {
    const { container } = render(<TestimonialVerticalMarquee items={items} columns={1} />)
    expect(container.querySelectorAll('.h-full.min-w-0')).toHaveLength(1)
    expect(screen.getAllByText('Quote B').length).toBeGreaterThan(0)
  })

  it('keeps copies after the first out of the accessibility tree', () => {
    render(<TestimonialVerticalMarquee items={items} columns={1} />)
    expect(screen.getAllByText('Quote A').filter((el) => !el.closest('[aria-hidden="true"]'))).toHaveLength(1)
  })
})
