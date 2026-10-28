import { fireEvent, render, screen } from '@testing-library/react'
import { TestimonialCarousel } from './testimonial-carousel'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialCarousel', () => {
  it('starts on the first slide and counts them', () => {
    render(<TestimonialCarousel items={items} />)
    expect(screen.getByText('Quote A')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('moves forward and back with the buttons and wraps around', async () => {
    render(<TestimonialCarousel items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }))
    expect(await screen.findByText('Quote C')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }))
    expect(await screen.findByText('Quote A')).toBeInTheDocument()
  })

  it('jumps with the dots and reports the index', async () => {
    const onIndexChange = vi.fn()
    render(<TestimonialCarousel items={items} onIndexChange={onIndexChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Show testimonial 2' }))
    expect(await screen.findByText('Quote B')).toBeInTheDocument()
    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(screen.getByRole('button', { name: 'Show testimonial 2' })).toHaveAttribute('aria-current', 'true')
  })

  it('answers the arrow keys and never advances on its own', async () => {
    vi.useFakeTimers()
    render(<TestimonialCarousel items={items} />)
    vi.advanceTimersByTime(30_000)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('group', { name: 'Testimonials' }), { key: 'ArrowRight' })
    vi.useRealTimers()
    expect(await screen.findByText('2 / 3')).toBeInTheDocument()
  })
})
