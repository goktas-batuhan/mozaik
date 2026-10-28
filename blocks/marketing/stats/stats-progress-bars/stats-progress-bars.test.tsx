import { render, screen } from '@testing-library/react'
import { StatsProgressBars } from './stats-progress-bars'

const stats = [
  { label: 'Coverage', value: 94, description: 'Across packages' },
  { label: 'Renewals', value: 120 },
  { label: 'Negative', value: -5 },
]

describe('StatsProgressBars', () => {
  it('renders a named progress bar for every stat', () => {
    render(<StatsProgressBars title="Quality" stats={stats} />)
    expect(screen.getByRole('region', { name: 'Quality' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Coverage' })).toHaveAttribute('aria-valuenow', '94')
    expect(screen.getAllByRole('progressbar')).toHaveLength(3)
  })

  it('clamps values into the 0 to 100 range', () => {
    render(<StatsProgressBars title="Quality" stats={stats} />)
    expect(screen.getByRole('progressbar', { name: 'Renewals' })).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByRole('progressbar', { name: 'Negative' })).toHaveAttribute('aria-valuenow', '0')
  })

  it('gives screen readers the final percentage', () => {
    render(<StatsProgressBars title="Quality" stats={stats} />)
    expect(screen.getByText('94', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('shows the description under a bar and fills it fully when disabled', () => {
    render(<StatsProgressBars title="Quality" stats={[stats[0]]} disabled />)
    expect(screen.getByText('Across packages')).toBeInTheDocument()
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({ width: '94%' })
  })
})
