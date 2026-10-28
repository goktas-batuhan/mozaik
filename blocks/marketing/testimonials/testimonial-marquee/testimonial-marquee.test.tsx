import { render, screen } from '@testing-library/react'
import { TestimonialMarquee } from './testimonial-marquee'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialMarquee', () => {
  it('labels the section with its headline', () => {
    render(<TestimonialMarquee title="Kind words" items={items} />)
    expect(screen.getByRole('region', { name: 'Kind words' })).toBeInTheDocument()
  })

  it('deals the testimonials out to the requested number of rows', () => {
    const { container } = render(<TestimonialMarquee items={items} rows={3} />)
    // 3 rows × 3 copies each; every copy after the first is aria-hidden
    expect(container.querySelectorAll('[aria-hidden="true"][inert]')).toHaveLength(6)
  })

  it('exposes each quote to assistive tech once', () => {
    render(<TestimonialMarquee items={items} rows={1} />)
    expect(screen.getAllByText('Quote A')).toHaveLength(3)
    expect(screen.getAllByText('Quote A').filter((el) => !el.closest('[aria-hidden="true"]'))).toHaveLength(1)
  })

  it('still renders the cards when disabled', () => {
    render(<TestimonialMarquee items={items} disabled />)
    expect(screen.getAllByText('Quote C').length).toBeGreaterThan(0)
  })
})
