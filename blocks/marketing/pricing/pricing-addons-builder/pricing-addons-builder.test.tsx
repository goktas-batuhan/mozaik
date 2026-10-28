import { fireEvent, render, screen } from '@testing-library/react'
import { PricingAddonsBuilder } from './pricing-addons-builder'

const plan = { name: 'Core', price: 20, features: ['One', 'Two'] }
const addons = [
  { id: 'a', name: 'Seats', description: 'More seats', price: 10 },
  { id: 'b', name: 'History', description: 'Restore', price: 5 },
]

describe('PricingAddonsBuilder', () => {
  it('starts with only the base plan in the total', () => {
    render(<PricingAddonsBuilder title="Build" plan={plan} addons={addons} />)
    expect(screen.getByText('20', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Seats/ })).not.toBeChecked()
  })

  it('adds a checked add-on to the receipt and the total', () => {
    render(<PricingAddonsBuilder title="Build" plan={plan} addons={addons} />)
    fireEvent.click(screen.getByRole('checkbox', { name: /Seats/ }))
    expect(screen.getByText('30', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.getByText('Seats', { selector: 'dt' })).toBeInTheDocument()
  })

  it('removes an add-on again when unchecked', () => {
    render(<PricingAddonsBuilder title="Build" plan={plan} addons={addons} defaultSelected={['a', 'b']} />)
    expect(screen.getByText('35', { selector: '.sr-only' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: /History/ }))
    expect(screen.getByText('30', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('hands the checked add-ons and total to onCheckout', () => {
    const onCheckout = vi.fn()
    render(<PricingAddonsBuilder title="Build" plan={plan} addons={addons} defaultSelected={['b']} actionLabel="Pay" onCheckout={onCheckout} />)
    fireEvent.click(screen.getByRole('button', { name: 'Pay' }))
    expect(onCheckout).toHaveBeenCalledWith([addons[1]], 25)
  })
})
