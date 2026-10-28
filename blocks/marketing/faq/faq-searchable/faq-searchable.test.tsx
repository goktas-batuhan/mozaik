import { fireEvent, render, screen } from '@testing-library/react'
import { FaqSearchable } from './faq-searchable'

const items = [
  { id: 'a', question: 'How do I export data?', answer: 'Use the export button in settings.' },
  { id: 'b', question: 'Is there a trial?', answer: 'Yes, fourteen days.' },
  { id: 'c', question: 'Who can join?', answer: 'Anyone you invite by email.' },
]

describe('FaqSearchable', () => {
  it('lists every question and the total count first', () => {
    render(<FaqSearchable items={items} />)
    expect(screen.getAllByRole('button', { name: /\?$/ })).toHaveLength(3)
    expect(screen.getByRole('status')).toHaveTextContent('3 questions')
  })

  it('filters by the text typed in the field', () => {
    render(<FaqSearchable items={items} />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search questions' }), { target: { value: 'trial' } })
    expect(screen.getAllByRole('button', { name: /\?$/ })).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('1 of 3 questions')
  })

  it('also matches words inside answers', () => {
    render(<FaqSearchable items={items} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'invite' } })
    expect(screen.getByRole('button', { name: 'Who can join?' })).toBeInTheDocument()
  })

  it('shows the empty message when nothing matches and recovers on clear', () => {
    render(<FaqSearchable items={items} emptyMessage="Nothing here" />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } })
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getAllByRole('button', { name: /\?$/ })).toHaveLength(3)
  })
})
