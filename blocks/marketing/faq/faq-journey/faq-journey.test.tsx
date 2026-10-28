import { fireEvent, render, screen } from '@testing-library/react'
import { FaqJourney } from './faq-journey'

const items = [
  { id: 'a', question: 'Question A?', answer: 'Answer A' },
  { id: 'b', question: 'Question B?', answer: 'Answer B' },
]

describe('FaqJourney', () => {
  it('renders one numbered step per question', () => {
    render(<FaqJourney items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
  })

  it('opens the step named by defaultOpen', () => {
    render(<FaqJourney items={items} defaultOpen="b" />)
    expect(screen.getByRole('button', { name: 'Question B?' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Answer B')).toBeInTheDocument()
  })

  it('keeps one answer open at a time', () => {
    render(<FaqJourney items={items} defaultOpen="a" />)
    fireEvent.click(screen.getByRole('button', { name: 'Question B?' }))
    expect(screen.getByRole('button', { name: 'Question A?' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Question B?' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the open step when clicked again', () => {
    render(<FaqJourney items={items} defaultOpen="a" />)
    fireEvent.click(screen.getByRole('button', { name: 'Question A?' }))
    expect(screen.getByRole('button', { name: 'Question A?' })).toHaveAttribute('aria-expanded', 'false')
  })
})
