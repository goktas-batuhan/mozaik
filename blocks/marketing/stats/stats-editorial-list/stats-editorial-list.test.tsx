import { render, screen } from '@testing-library/react'
import { StatsEditorialList } from './stats-editorial-list'

const stats = [
  { value: 1200, label: 'Founded', description: 'Two founders' },
  { value: 38, suffix: '%', label: 'Faster' },
  { value: 1.4, suffix: 'M', decimalPlaces: 1, label: 'Projects' },
]

describe('StatsEditorialList', () => {
  it('labels the section and lists one row per stat in order', () => {
    render(<StatsEditorialList title="Numbers" stats={stats} />)
    expect(screen.getByRole('region', { name: 'Numbers' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Founded', 'Faster', 'Projects'])
  })

  it('uses an ordered list', () => {
    render(<StatsEditorialList title="Numbers" stats={stats} />)
    expect(screen.getByRole('list').tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('formats final numbers for screen readers', () => {
    render(<StatsEditorialList title="Numbers" stats={stats} />)
    expect(screen.getByText('1,200', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByText('1.4', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('shows the eyebrow and explanations when given', () => {
    render(<StatsEditorialList title="Numbers" eyebrow="By the numbers" stats={stats} />)
    expect(screen.getByText('By the numbers')).toBeInTheDocument()
    expect(screen.getByText('Two founders')).toBeInTheDocument()
  })
})
