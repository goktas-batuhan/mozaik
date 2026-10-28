import { render, screen } from '@testing-library/react'
import { StatsSparklineCards } from './stats-sparkline-cards'

const stats = [
  { label: 'Signups', value: 120, history: [1, 3, 2, 5], caption: 'Last 4 weeks' },
  { label: 'Latency', value: 80, suffix: ' ms', history: [9, 8, 7] },
]

describe('StatsSparklineCards', () => {
  it('renders a card per stat under a labelled section', () => {
    render(<StatsSparklineCards title="Growth" stats={stats} />)
    expect(screen.getByRole('region', { name: 'Growth' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('describes every chart with an accessible name', () => {
    render(<StatsSparklineCards title="Growth" stats={stats} />)
    expect(screen.getByRole('img', { name: 'Signups trend' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Latency trend' })).toBeInTheDocument()
  })

  it('draws the line through the lowest and highest points of the history', () => {
    render(<StatsSparklineCards title="Growth" stats={[stats[0]]} />)
    const paths = screen.getByRole('img').querySelectorAll('path')
    const line = paths[1].getAttribute('d')!
    // 1 is the minimum (bottom), 5 the maximum (top) with 4px padding on a 48px chart.
    expect(line).toBe('M0 44 L53 24 L107 34 L160 4')
  })

  it('shows captions and the final values', () => {
    render(<StatsSparklineCards title="Growth" stats={stats} />)
    expect(screen.getByText('Last 4 weeks')).toBeInTheDocument()
    expect(screen.getByText('120', { selector: '.sr-only' })).toBeInTheDocument()
  })
})
