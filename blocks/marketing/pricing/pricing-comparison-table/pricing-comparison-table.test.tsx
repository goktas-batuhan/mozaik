import { render, screen, within } from '@testing-library/react'
import { PricingComparisonTable } from './pricing-comparison-table'

const plans = [
  { name: 'Free', price: '$0', action: { label: 'Join', href: '/join' } },
  { name: 'Pro', price: '$20', highlight: true, action: { label: 'Buy' } },
]
const groups = [
  {
    name: 'Usage',
    rows: [
      { label: 'Projects', values: ['3', 'Unlimited'] },
      { label: 'Domains', values: [false, true] },
    ],
  },
]

describe('PricingComparisonTable', () => {
  it('renders a table with a column per plan and a row per feature', () => {
    render(<PricingComparisonTable title="Compare" plans={plans} groups={groups} />)
    expect(screen.getByRole('region', { name: 'Compare' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Pro/ })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Domains' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Projects' })).toBeInTheDocument()
  })

  it('tells screen readers whether a feature is included', () => {
    render(<PricingComparisonTable title="Compare" plans={plans} groups={groups} />)
    const row = screen.getByRole('rowheader', { name: 'Domains' }).closest('tr')!
    expect(within(row).getByText('Not included')).toBeInTheDocument()
    expect(within(row).getByText('Included')).toBeInTheDocument()
  })

  it('prints text values as they are', () => {
    render(<PricingComparisonTable title="Compare" plans={plans} groups={groups} />)
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })

  it('renders links and buttons for the plan actions', () => {
    render(<PricingComparisonTable title="Compare" plans={plans} groups={groups} />)
    expect(screen.getByRole('link', { name: 'Join' })).toHaveAttribute('href', '/join')
    expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument()
  })
})
