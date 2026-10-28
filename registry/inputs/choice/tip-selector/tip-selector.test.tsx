import { fireEvent, render, screen } from '@testing-library/react'
import { TipSelector } from './tip-selector'

describe('TipSelector', () => {
  it('starts on the default percent', () => {
    render(<TipSelector subtotal={100} defaultValue={18} />)
    expect(screen.getByRole('button', { name: '18%' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '18%, $18.00')
  })

  it('picks a preset and reports tip amount and percent', () => {
    const onChange = vi.fn()
    render(<TipSelector subtotal={42.6} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: '20%' }))
    expect(onChange).toHaveBeenLastCalledWith(8.52, 20)
    expect(screen.getByRole('button', { name: '20%' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '18%' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('moves with the keyboard through the range input', () => {
    const onChange = vi.fn()
    render(<TipSelector subtotal={100} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '25' } })
    expect(onChange).toHaveBeenLastCalledWith(25, 25)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '25%, $25.00')
  })

  it('rounds the total up to a whole amount', () => {
    const onChange = vi.fn()
    const onPay = vi.fn()
    render(<TipSelector subtotal={42.6} defaultValue={18} onChange={onChange} onPay={onPay} />)
    fireEvent.click(screen.getByRole('button', { name: 'Round up' }))
    expect(onChange.mock.lastCall?.[0]).toBe(8.4)
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }))
    expect(onPay).toHaveBeenCalledWith(51)
    expect(screen.getByRole('button', { name: /Paid, thank you/ })).toBeInTheDocument()
  })

  it('follows the controlled percent and does not change by itself', () => {
    const { rerender } = render(<TipSelector subtotal={100} value={10} />)
    fireEvent.click(screen.getByRole('button', { name: '20%' }))
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '10%, $10.00')
    rerender(<TipSelector subtotal={100} value={20} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '20%, $20.00')
  })
})
