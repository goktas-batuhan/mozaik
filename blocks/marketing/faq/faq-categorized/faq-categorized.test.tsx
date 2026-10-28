import { fireEvent, render, screen } from '@testing-library/react'
import { FaqCategorized } from './faq-categorized'

const categories = [
  { id: 'one', label: 'One', items: [{ id: 'q1', question: 'First question?', answer: 'First answer' }] },
  { id: 'two', label: 'Two', items: [{ id: 'q2', question: 'Second question?', answer: 'Second answer' }] },
]

describe('FaqCategorized', () => {
  it('shows the first category by default', () => {
    render(<FaqCategorized categories={categories} />)
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'First question?' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Second question?' })).not.toBeInTheDocument()
  })

  it('switches category on click and reports it', () => {
    const onCategoryChange = vi.fn()
    render(<FaqCategorized categories={categories} onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }))
    expect(screen.getByRole('button', { name: 'Second question?' })).toBeInTheDocument()
    expect(onCategoryChange).toHaveBeenCalledWith('two')
  })

  it('moves between tabs with the arrow keys', () => {
    render(<FaqCategorized categories={categories} />)
    fireEvent.keyDown(screen.getByRole('tab', { name: 'One' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Two' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
  })

  it('starts on defaultCategory and links the panel to its tab', () => {
    render(<FaqCategorized categories={categories} defaultCategory="two" />)
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Two')
  })
})
