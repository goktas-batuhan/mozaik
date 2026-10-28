import { fireEvent, render, screen } from '@testing-library/react'
import { AISuggestions } from './ai-suggestions'

const items = [
  { id: 'a', label: 'Summarize' },
  { id: 'b', label: 'Translate' },
]

describe('AISuggestions', () => {
  it('renders one button per suggestion in a list', () => {
    render(<AISuggestions suggestions={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Translate' })).toBeInTheDocument()
  })

  it('calls onSelect with the chosen suggestion', () => {
    const onSelect = vi.fn()
    render(<AISuggestions suggestions={items} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Summarize' }))
    expect(onSelect).toHaveBeenCalledWith(items[0])
  })

  it('shows the label only when given', () => {
    const { rerender } = render(<AISuggestions suggestions={items} />)
    expect(screen.queryByText('Follow-ups')).toBeNull()
    rerender(<AISuggestions suggestions={items} label="Follow-ups" />)
    expect(screen.getByText('Follow-ups')).toBeInTheDocument()
  })

  it('disables every chip', () => {
    const onSelect = vi.fn()
    render(<AISuggestions suggestions={items} onSelect={onSelect} disabled />)
    const button = screen.getByRole('button', { name: 'Summarize' })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
