import { render, screen } from '@testing-library/react'
import { StatsTrendCards } from './stats-trend-cards'

const stats = [
  { label: 'Revenue', value: 2.5, prefix: '$', suffix: 'M', decimalPlaces: 1, trend: { value: '12%', direction: 'up' as const } },
  { label: 'Churn', value: 1.8, suffix: '%', decimalPlaces: 1, trend: { value: '0.4%', direction: 'down' as const } },
  { label: 'Plain', value: 7 },
]

describe('StatsTrendCards', () => {
  it('lists one card per stat under a labelled section', () => {
    render(<StatsTrendCards title="Metrics" stats={stats} />)
    expect(screen.getByRole('region', { name: 'Metrics' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('says in words whether a trend went up or down', () => {
    render(<StatsTrendCards title="Metrics" stats={stats} trendNote="vs last month" />)
    expect(screen.getByText(/Up/, { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByText(/Down/, { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getAllByText('vs last month')).toHaveLength(2)
  })

  it('colours a rising trend as success and a falling one as destructive', () => {
    render(<StatsTrendCards title="Metrics" stats={stats} />)
    expect(screen.getByText('12%')).toHaveClass('text-success')
    expect(screen.getByText('0.4%')).toHaveClass('text-destructive')
  })

  it('hides decorative icons from assistive tech and skips the chip without a trend', () => {
    render(<StatsTrendCards title="Metrics" stats={[{ ...stats[2], icon: <svg data-testid="icon" /> }]} />)
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByText('Up', { exact: false })).not.toBeInTheDocument()
  })
})
