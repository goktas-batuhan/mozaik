import { fireEvent, render, screen } from '@testing-library/react'
import { FaqTwoColumn } from './faq-two-column'

const items = [
  { id: 'a', question: 'Question A?', answer: 'Answer A' },
  { id: 'b', question: 'Question B?', answer: 'Answer B' },
]
const support = { name: 'Mara Ellison', role: 'Support', actionLabel: 'Contact us', href: '/contact' }

describe('FaqTwoColumn', () => {
  it('labels the section with its headline', () => {
    render(<FaqTwoColumn title="Questions" items={items} />)
    expect(screen.getByRole('region', { name: 'Questions' })).toBeInTheDocument()
  })

  it('shows the support card with initials and a link', () => {
    render(<FaqTwoColumn items={items} support={support} />)
    expect(screen.getByText('ME')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/contact')
  })

  it('renders a button when the card has no href', () => {
    const onClick = vi.fn()
    render(<FaqTwoColumn items={items} support={{ ...support, href: undefined, onClick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Contact us' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('opens an answer on click', () => {
    render(<FaqTwoColumn items={items} />)
    fireEvent.click(screen.getByRole('button', { name: 'Question B?' }))
    expect(screen.getByText('Answer B')).toBeInTheDocument()
  })
})
