import { fireEvent, render, screen } from '@testing-library/react'
import { FaqAccordion } from './faq-accordion'

const items = [
  { id: 'a', question: 'Question A?', answer: 'Answer A' },
  { id: 'b', question: 'Question B?', answer: 'Answer B' },
]

describe('FaqAccordion', () => {
  it('labels the section with its headline', () => {
    render(<FaqAccordion title="Help" items={items} />)
    expect(screen.getByRole('region', { name: 'Help' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Help' })).toBeInTheDocument()
  })

  it('opens the questions listed in defaultOpen', () => {
    render(<FaqAccordion items={items} defaultOpen={['b']} />)
    expect(screen.getByText('Answer B')).toBeInTheDocument()
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
  })

  it('toggles an answer when its question is clicked', () => {
    render(<FaqAccordion items={items} />)
    const button = screen.getByRole('button', { name: 'Question A?' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Answer A')).toBeInTheDocument()
  })

  it('keeps one answer open in single mode and several in multiple mode', () => {
    const { rerender } = render(<FaqAccordion items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Question A?' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question B?' }))
    expect(screen.getByRole('button', { name: 'Question A?' })).toHaveAttribute('aria-expanded', 'false')
    rerender(<FaqAccordion key="m" items={items} type="multiple" />)
    fireEvent.click(screen.getByRole('button', { name: 'Question A?' }))
    fireEvent.click(screen.getByRole('button', { name: 'Question B?' }))
    expect(screen.getByRole('button', { name: 'Question A?' })).toHaveAttribute('aria-expanded', 'true')
  })
})
