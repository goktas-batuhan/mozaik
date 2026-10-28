import { render, screen } from '@testing-library/react'
import { FeaturesMetricsBeam } from './features-metrics-beam'

const metrics = [
  { value: '99.99%', label: 'Uptime', description: 'All year.' },
  { value: '42ms', label: 'Latency', description: 'At the edge.' },
  { value: '3x', label: 'Speed', description: 'Faster.' },
]

describe('FeaturesMetricsBeam', () => {
  it('labels the section with its headline', () => {
    render(<FeaturesMetricsBeam title="Numbers" metrics={metrics} />)
    expect(screen.getByRole('region', { name: 'Numbers' })).toBeInTheDocument()
  })

  it('pairs every figure with its label in a description list', () => {
    render(<FeaturesMetricsBeam title="Numbers" metrics={metrics} />)
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['Uptime', 'Latency', 'Speed'])
    expect(screen.getByText('42ms')).toBeInTheDocument()
    expect(screen.getByText('At the edge.')).toBeInTheDocument()
  })

  it('puts the travelling light on the lead card only', () => {
    const { container } = render(<FeaturesMetricsBeam title="Numbers" metrics={metrics} />)
    const beams = container.querySelectorAll('[aria-hidden="true"].pointer-events-none')
    expect(beams).toHaveLength(1)
    expect(screen.getByText('99.99%').parentElement).toContainElement(beams[0] as HTMLElement)
  })

  it('drops the light when disabled', () => {
    const { container } = render(<FeaturesMetricsBeam title="Numbers" metrics={metrics} disabled />)
    expect(container.querySelectorAll('[aria-hidden="true"].pointer-events-none')).toHaveLength(0)
  })

  it('renders without metrics', () => {
    render(<FeaturesMetricsBeam title="Empty" metrics={[]} />)
    expect(screen.getByRole('region', { name: 'Empty' })).toBeInTheDocument()
  })
})
