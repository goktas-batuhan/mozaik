import { render, screen } from '@testing-library/react'
import { FaqGrid } from './faq-grid'

const items = [
  { id: 'a', question: 'Question A?', answer: 'Answer A' },
  { id: 'b', question: 'Question B?', answer: 'Answer B' },
]

describe('FaqGrid', () => {
  it('labels the section with its headline', () => {
    render(<FaqGrid title="Good to know" items={items} />)
    expect(screen.getByRole('region', { name: 'Good to know' })).toBeInTheDocument()
  })

  it('shows every question and answer without interaction', () => {
    render(<FaqGrid items={items} disabled />)
    expect(screen.getByText('Question A?')).toBeVisible()
    expect(screen.getByText('Answer B')).toBeVisible()
  })

  it('pairs terms and definitions in a description list', () => {
    const { container } = render(<FaqGrid items={items} />)
    expect(container.querySelectorAll('dt')).toHaveLength(2)
    expect(container.querySelectorAll('dd')).toHaveLength(2)
  })

  it('numbers the entries and starts fully visible when disabled', () => {
    render(<FaqGrid items={items} disabled />)
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('Question A?').closest('div')!.style.opacity).not.toBe('0')
  })
})
