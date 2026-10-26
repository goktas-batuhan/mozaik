import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { UptimeCard, type UptimeService } from './uptime-card'

const services: UptimeService[] = [
  {
    name: 'API',
    history: ['up', 'up', 'degraded', 'up'],
    incidents: [{ day: 2, title: 'Slow writes', minutes: 18 }],
  },
  { name: 'Web', history: ['none', 'up', 'down', 'down'] },
]

const setup = () => render(<UptimeCard services={services} endDate="2026-10-14" />)

describe('UptimeCard', () => {
  it('renders each service with its uptime and a label for every bar', () => {
    setup()
    expect(screen.getByText('87.50% uptime')).toBeInTheDocument()
    expect(screen.getByLabelText('API, daily status for the last 4 days').querySelectorAll('li')).toHaveLength(4)
    expect(screen.getByText('Tue, Oct 13: Degraded')).toBeInTheDocument()
    expect(screen.getByText('Sun, Oct 11: No data')).toBeInTheDocument()
  })

  it('summarises the current state and the recent incidents', () => {
    setup()
    expect(screen.getByText('1 service affected')).toBeInTheDocument()
    expect(screen.getByText('Slow writes')).toBeInTheDocument()
  })

  it('inspects a day with the arrow keys and announces it politely', () => {
    const { container } = setup()
    const row = screen.getByLabelText('API, daily status for the last 4 days')
    expect(row).toHaveAttribute('tabindex', '0')
    fireEvent.keyDown(row, { key: 'ArrowLeft' })
    const live = container.querySelector('[aria-live="polite"]')!
    expect(live).toHaveTextContent('API, Tue, Oct 13: Degraded. Slow writes, 18 min')
  })

  it('ignores the keyboard when disabled', () => {
    const { container } = render(<UptimeCard services={services} endDate="2026-10-14" disabled />)
    const row = screen.getByLabelText('API, daily status for the last 4 days')
    expect(row).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(row, { key: 'ArrowLeft' })
    expect(container.querySelector('[aria-live="polite"]')).not.toHaveTextContent('Degraded')
  })

  it('renders at full size under reduced motion', () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <UptimeCard services={services} endDate="2026-10-14" />
      </MotionConfig>,
    )
    const bar = container.querySelector('li')!
    expect(bar.style.opacity === '' || bar.style.opacity === '1').toBe(true)
    expect(bar.style.transform).not.toContain('scaleY(0)')
  })
})
