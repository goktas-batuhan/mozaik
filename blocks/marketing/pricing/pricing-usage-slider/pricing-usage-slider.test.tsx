import { fireEvent, render, screen } from '@testing-library/react'
import { PricingUsageSlider } from './pricing-usage-slider'

const base = { title: 'Usage', basePrice: 20, included: 5, unitPrice: 6, action: { label: 'Start', href: '/go' } }

describe('PricingUsageSlider', () => {
  it('prices the starting amount from the base and the extra units', () => {
    render(<PricingUsageSlider {...base} defaultValue={10} />)
    expect(screen.getByRole('slider', { name: 'seats' })).toHaveValue('10')
    // 20 + (10 - 5) * 6
    expect(screen.getByText('50', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('updates the total and calls onChange as the slider moves', () => {
    const onChange = vi.fn()
    render(<PricingUsageSlider {...base} defaultValue={10} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '20' } })
    expect(onChange).toHaveBeenCalledWith(20)
    expect(screen.getByText('110', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('charges only the base price at or below the included amount', () => {
    render(<PricingUsageSlider {...base} defaultValue={3} />)
    expect(screen.getByText('20', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('clamps the starting amount into range and names the unit', () => {
    render(<PricingUsageSlider {...base} unit="member" min={2} max={8} defaultValue={99} />)
    expect(screen.getByRole('slider', { name: 'members' })).toHaveValue('8')
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/go')
  })
})
