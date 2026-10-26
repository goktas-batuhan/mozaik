import { render, screen } from '@testing-library/react'
import { NumberTicker } from './number-ticker'

describe('NumberTicker', () => {
  it('exposes the final formatted number to assistive tech', () => {
    render(<NumberTicker value={1234} />)
    expect(screen.getByText('1,234', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('shows the final number straight away when disabled', () => {
    const { container } = render(<NumberTicker value={50} decimalPlaces={1} disabled />)
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('50.0')
  })

  it('shows the start value before it scrolls into view', () => {
    const { container } = render(<NumberTicker value={90} startValue={10} />)
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('10')
  })
})
