import { fireEvent, render, screen } from '@testing-library/react'
import { PricingCreditPacks } from './pricing-credit-packs'

const packs = [
  { id: 'a', credits: 100, price: 10 },
  { id: 'b', credits: 500, price: 40, badge: 'Best value' },
  { id: 'c', credits: 2000, price: 100 },
]

describe('PricingCreditPacks', () => {
  it('selects the second pack first and sums it up', () => {
    render(<PricingCreditPacks title="Credits" packs={packs} />)
    expect(screen.getByRole('radio', { name: /500/ })).toBeChecked()
    expect(screen.getByText('Best value')).toBeInTheDocument()
    expect(screen.getByText(/that is \$0\.080 each/)).toBeInTheDocument()
  })

  it('updates the summary when another pack is picked', () => {
    render(<PricingCreditPacks title="Credits" packs={packs} />)
    fireEvent.click(screen.getByRole('radio', { name: /2,000/ }))
    expect(screen.getByRole('radio', { name: /2,000/ })).toBeChecked()
    expect(screen.getByText(/that is \$0\.050 each/)).toBeInTheDocument()
  })

  it('passes the chosen pack to onBuy', () => {
    const onBuy = vi.fn()
    render(<PricingCreditPacks title="Credits" packs={packs} defaultPackId="a" onBuy={onBuy} actionLabel="Buy" />)
    fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    expect(onBuy).toHaveBeenCalledWith(packs[0])
  })

  it('uses the given credit label', () => {
    render(<PricingCreditPacks title="Credits" packs={packs} creditLabel="renders" />)
    expect(screen.getAllByText('renders')).toHaveLength(3)
  })
})
