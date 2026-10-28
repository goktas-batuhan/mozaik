import { fireEvent, render, screen } from '@testing-library/react'
import { PricingPlanList } from './pricing-plan-list'

const plans = [
  { id: 'a', name: 'Solo', description: 'One', price: '$9', features: ['Notes'] },
  { id: 'b', name: 'Team', description: 'Many', price: '$22', per: '/ month', features: ['Shared', 'Comments'] },
]

describe('PricingPlanList', () => {
  it('selects the first plan by default and shows its features', () => {
    render(<PricingPlanList title="Plans" plans={plans} />)
    expect(screen.getByRole('radio', { name: /Solo/ })).toBeChecked()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('follows the selection in the summary panel', () => {
    render(<PricingPlanList title="Plans" plans={plans} />)
    fireEvent.click(screen.getByRole('radio', { name: /Team/ }))
    expect(screen.getByRole('radio', { name: /Team/ })).toBeChecked()
    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.queryByText('Notes')).not.toBeInTheDocument()
  })

  it('moves the selection with the arrow keys', () => {
    render(<PricingPlanList title="Plans" plans={plans} />)
    fireEvent.keyDown(screen.getByRole('radio', { name: /Solo/ }), { key: 'ArrowDown' })
    expect(screen.getByRole('radio', { name: /Team/ })).toBeChecked()
    fireEvent.keyDown(screen.getByRole('radio', { name: /Team/ }), { key: 'ArrowDown' })
    expect(screen.getByRole('radio', { name: /Solo/ })).toBeChecked()
  })

  it('reports the chosen plan through onSelect', () => {
    const onSelect = vi.fn()
    render(<PricingPlanList title="Plans" plans={plans} defaultPlanId="b" actionLabel="Go" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onSelect).toHaveBeenCalledWith(plans[1])
  })
})
