import { fireEvent, render, screen } from '@testing-library/react'
import { TestimonialStack } from './testimonial-stack'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialStack', () => {
  it('counts from the first card', () => {
    render(<TestimonialStack items={items} />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('exposes only the top card to assistive tech', () => {
    render(<TestimonialStack items={items} />)
    expect(screen.getAllByRole('figure')).toHaveLength(1)
    expect(screen.getAllByRole('figure', { hidden: true })).toHaveLength(3)
    expect(screen.getByRole('figure')).toHaveTextContent('Quote A')
  })

  it('brings the next card to the top and wraps', () => {
    render(<TestimonialStack items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText('Quote B').closest('[aria-hidden]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })
})
