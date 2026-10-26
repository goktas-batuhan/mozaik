import { render, screen } from '@testing-library/react'
import { PriceTicker } from './price-ticker'

describe('PriceTicker', () => {
  it('announces the formatted value politely', () => {
    const { container } = render(<PriceTicker value={1234.5} currency="USD" label="ETH price" />)
    const root = container.firstElementChild!
    expect(root).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('ETH price: $1,234.50')).toBeInTheDocument()
  })

  it('shows the change against previousValue', () => {
    const { container } = render(<PriceTicker value={110} previousValue={100} />)
    const badge = container.querySelector('[data-trend]')
    expect(badge).toHaveAttribute('data-trend', 'up')
    expect(badge).toHaveTextContent('+10.00%')
  })

  it('uses the last shown value as reference when previousValue is missing', () => {
    const { container, rerender } = render(<PriceTicker value={200} />)
    expect(container.querySelector('[data-trend]')).toBeNull()
    rerender(<PriceTicker value={150} />)
    const badge = container.querySelector('[data-trend]')
    expect(badge).toHaveAttribute('data-trend', 'down')
    expect(badge).toHaveTextContent('-25.00%')
  })

  it('respects decimals and hides the badge when asked', () => {
    const { container } = render(<PriceTicker value={0.84213} decimals={4} previousValue={1} showChange={false} />)
    expect(container).toHaveTextContent('0.8421')
    expect(container.querySelector('[data-trend]')).toBeNull()
  })
})
