import { render, screen } from '@testing-library/react'
import { TestimonialChat } from './testimonial-chat'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialChat', () => {
  it('labels the section with its headline', () => {
    render(<TestimonialChat title="Inbox" items={items} />)
    expect(screen.getByRole('region', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('renders one message per testimonial with the author underneath', () => {
    render(<TestimonialChat items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText(/Jonas Weber/)).toBeInTheDocument()
  })

  it('alternates the side of the bubbles', () => {
    render(<TestimonialChat items={items} />)
    const rows = screen.getAllByRole('listitem')
    expect(rows[0]).not.toHaveClass('flex-row-reverse')
    expect(rows[1]).toHaveClass('flex-row-reverse')
    expect(rows[2]).not.toHaveClass('flex-row-reverse')
  })

  it('starts fully visible when disabled', () => {
    render(<TestimonialChat items={items} disabled />)
    expect(screen.getAllByRole('listitem')[0]!.style.opacity).not.toBe('0')
  })
})
