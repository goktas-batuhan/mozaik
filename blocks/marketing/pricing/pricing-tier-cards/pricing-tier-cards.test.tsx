import { fireEvent, render, screen } from '@testing-library/react'
import { PricingTierCards, type PricingTier } from './pricing-tier-cards'

const tiers: PricingTier[] = [
  { name: 'Free', monthly: 0, yearly: 0, features: ['One'], action: { label: 'Join', href: '/join' } },
  { name: 'Team', monthly: 30, yearly: 24, features: ['Two', 'Three'], featured: true, badge: 'Popular', action: { label: 'Try' } },
]

describe('PricingTierCards', () => {
  it('renders one labelled card per tier with its features', () => {
    render(<PricingTierCards title="Plans" tiers={tiers} />)
    expect(screen.getByRole('region', { name: 'Plans' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Team plan' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Popular')).toBeInTheDocument()
  })

  it('shows monthly prices first and yearly prices after the switch', () => {
    render(<PricingTierCards title="Plans" tiers={tiers} />)
    expect(screen.getByText('30', { selector: '.sr-only' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Yearly' }))
    expect(screen.getByText('24', { selector: '.sr-only' })).toBeInTheDocument()
    expect(screen.queryByText('30', { selector: '.sr-only' })).not.toBeInTheDocument()
  })

  it('moves the billing switch with the arrow keys', () => {
    render(<PricingTierCards title="Plans" tiers={tiers} />)
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Monthly' }), { key: 'ArrowRight' })
    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked()
  })

  it('renders links for href actions and buttons otherwise', () => {
    render(<PricingTierCards title="Plans" tiers={tiers} />)
    expect(screen.getByRole('link', { name: 'Join' })).toHaveAttribute('href', '/join')
    expect(screen.getByRole('button', { name: 'Try' })).toBeInTheDocument()
  })
})
