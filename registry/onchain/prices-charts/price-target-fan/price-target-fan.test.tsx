import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { PriceTargetFan } from './price-target-fan'

const still = (ui: React.ReactNode) => render(<MotionConfig reducedMotion="always">{ui}</MotionConfig>)
const history = [100, 104, 102, 110]
const fmt = (v: number) => `$${v}`

describe('PriceTargetFan', () => {
  it('summarises the current price and each target with its move', () => {
    still(<PriceTargetFan history={history} targets={{ low: 99, avg: 132, high: 165 }} formatPrice={fmt} label="ACME" horizon="6 months" />)
    const text = screen.getByRole('img').getAttribute('aria-label')!
    expect(text).toContain('ACME: now $110')
    expect(text).toContain('in 6 months')
    expect(text).toContain('low $99 (-10.0%)')
    expect(text).toContain('average $132 (+20.0%)')
    expect(text).toContain('high $165 (+50.0%)')
  })

  it('places the high target above the low target', () => {
    const { container } = still(<PriceTargetFan history={history} targets={{ low: 90, avg: 120, high: 150 }} />)
    const cy = (name: string) => Number(container.querySelector(`[data-tag="${name}"] circle`)!.getAttribute('cy'))
    expect(cy('high')).toBeLessThan(cy('avg'))
    expect(cy('avg')).toBeLessThan(cy('low'))
  })

  it('labels the three targets with formatted prices', () => {
    still(<PriceTargetFan history={history} targets={{ low: 90, avg: 120, high: 150 }} formatPrice={fmt} />)
    expect(screen.getByText('$150')).toBeInTheDocument()
    expect(screen.getByText('$120')).toBeInTheDocument()
    expect(screen.getByText('$90')).toBeInTheDocument()
    expect(screen.getByText('Now $110')).toBeInTheDocument()
  })

  it('draws the history, the average and the cone', () => {
    const { container } = still(<PriceTargetFan history={history} targets={{ low: 90, avg: 120, high: 150 }} />)
    expect(container.querySelector('[data-part="history"]')!.getAttribute('d')).toMatch(/^M/)
    expect(container.querySelector('[data-part="average"]')).toBeInTheDocument()
    expect(container.querySelector('[data-part="cone"]')).toBeInTheDocument()
  })

  it('handles too little data', () => {
    still(<PriceTargetFan history={[10]} targets={{ low: 1, avg: 2, high: 3 }} label="Empty" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Empty: no data')
  })
})
