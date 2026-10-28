import { render, screen } from '@testing-library/react'
import { StatsGrid } from './stats-grid'

const stats = [
  { value: 10, suffix: 'M+', label: 'Users', description: 'Growing' },
  { value: 99.9, suffix: '%', decimalPlaces: 1, label: 'Uptime' },
  { value: 4, prefix: '$', label: 'Revenue' },
]

describe('StatsGrid', () => {
  it('labels the section with its headline', () => {
    render(<StatsGrid title="Impact" stats={stats} />)
    expect(screen.getByRole('region', { name: 'Impact' })).toBeInTheDocument()
  })

  it('pairs every number with its label', () => {
    render(<StatsGrid title="Impact" stats={stats} />)
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Uptime')).toBeInTheDocument()
    expect(screen.getByText('Growing')).toBeInTheDocument()
  })

  it('gives screen readers the final numbers with decimals', () => {
    render(<StatsGrid title="Impact" stats={stats} />)
    expect(screen.getByText('10', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByText('99.9', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('shows the final numbers straight away when disabled', () => {
    const { container } = render(<StatsGrid title="Impact" stats={stats} disabled />)
    const visible = [...container.querySelectorAll('[aria-hidden="true"]')].map((n) => n.textContent)
    expect(visible).toEqual(['10', '99.9', '4'])
  })
})
