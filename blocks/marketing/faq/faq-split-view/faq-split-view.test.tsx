import { fireEvent, render, screen } from '@testing-library/react'
import { FaqSplitView } from './faq-split-view'

const items = [
  { id: 'a', question: 'Question A?', answer: 'Answer A' },
  { id: 'b', question: 'Question B?', answer: 'Answer B' },
  { id: 'c', question: 'Question C?', answer: 'Answer C' },
]

describe('FaqSplitView', () => {
  it('selects the first question and shows its answer', () => {
    render(<FaqSplitView items={items} />)
    expect(screen.getByRole('tab', { name: 'Question A?' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Answer A')
  })

  it('shows another answer when its question is clicked', async () => {
    render(<FaqSplitView items={items} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Question C?' }))
    expect(await screen.findByText('Answer C')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Question C?' })).toHaveAttribute('aria-selected', 'true')
  })

  it('moves the selection with the arrow keys and wraps', () => {
    render(<FaqSplitView items={items} />)
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Question A?' }), { key: 'ArrowUp' })
    expect(screen.getByRole('tab', { name: 'Question C?' })).toHaveAttribute('aria-selected', 'true')
  })

  it('starts on defaultSelected and only the selected tab is tabbable', () => {
    render(<FaqSplitView items={items} defaultSelected="b" />)
    expect(screen.getByRole('tab', { name: 'Question B?' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Question A?' })).toHaveAttribute('tabindex', '-1')
  })
})
