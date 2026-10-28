import { render, screen } from '@testing-library/react'
import { TestimonialMetrics } from './testimonial-metrics'

const items = [
  { id: 'a', metric: '3x', metricLabel: 'faster releases', name: 'Mara Ellison', role: 'Designer', quote: 'Quote A' },
  { id: 'b', metric: '-40%', metricLabel: 'support tickets', name: 'Jonas Weber', company: 'Tidewater', quote: 'Quote B' },
]

describe('TestimonialMetrics', () => {
  it('labels the section with its headline', () => {
    render(<TestimonialMetrics title="Results" items={items} />)
    expect(screen.getByRole('region', { name: 'Results' })).toBeInTheDocument()
  })

  it('leads each card with its result and label', () => {
    render(<TestimonialMetrics items={items} />)
    expect(screen.getByText('3x')).toBeInTheDocument()
    expect(screen.getByText('faster releases')).toBeInTheDocument()
    expect(screen.getByText('-40%')).toBeInTheDocument()
  })

  it('renders the quote and author of every card', () => {
    render(<TestimonialMetrics items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Quote B')).toBeInTheDocument()
    expect(screen.getByText('Designer')).toBeInTheDocument()
    expect(screen.getByText('Tidewater')).toBeInTheDocument()
  })
})
