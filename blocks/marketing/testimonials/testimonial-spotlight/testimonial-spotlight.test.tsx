import { fireEvent, render, screen } from '@testing-library/react'
import { TestimonialSpotlight } from './testimonial-spotlight'

const items = [
  { id: 'a', name: 'Mara Ellison', role: 'Designer', company: 'Fernhill', quote: 'Quote A' },
  { id: 'b', name: 'Jonas Weber', role: 'Engineer', quote: 'Quote B' },
  { id: 'c', name: 'Priya Raman', quote: 'Quote C' },
]

describe('TestimonialSpotlight', () => {
  it('puts the first person in the spotlight', () => {
    render(<TestimonialSpotlight items={items} />)
    expect(screen.getByRole('tab', { name: 'Mara Ellison' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Quote A')
  })

  it('switches the quote when another avatar is picked', async () => {
    render(<TestimonialSpotlight items={items} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Priya Raman' }))
    expect(await screen.findByText('Quote C')).toBeInTheDocument()
  })

  it('moves with the arrow keys and wraps', () => {
    render(<TestimonialSpotlight items={items} />)
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Mara Ellison' }), { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: 'Priya Raman' })).toHaveAttribute('aria-selected', 'true')
  })

  it('starts on defaultSelected with only that tab tabbable', () => {
    render(<TestimonialSpotlight items={items} defaultSelected="b" />)
    expect(screen.getByRole('tab', { name: 'Jonas Weber' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Mara Ellison' })).toHaveAttribute('tabindex', '-1')
  })
})
