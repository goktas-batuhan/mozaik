import { fireEvent, render, screen } from '@testing-library/react'
import { PricingSingleCard } from './pricing-single-card'

const plan = {
  name: 'Pro',
  monthly: 24,
  yearly: 19,
  features: ['Unlimited projects', 'Custom domains'],
  action: { label: 'Get started', href: '/signup' },
}

describe('PricingSingleCard', () => {
  it('labels the section with its headline and lists the features', () => {
    render(<PricingSingleCard title="One plan" plan={plan} />)
    expect(screen.getByRole('region', { name: 'One plan' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('starts on the yearly price and switches to monthly', () => {
    const onPeriodChange = vi.fn()
    render(<PricingSingleCard title="One plan" plan={plan} onPeriodChange={onPeriodChange} />)
    expect(screen.getByText('19', { selector: '.sr-only' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Monthly' }))
    expect(screen.getByText('24', { selector: '.sr-only' })).toBeInTheDocument()
    expect(onPeriodChange).toHaveBeenCalledWith('monthly')
  })

  it('can start on the monthly price', () => {
    render(<PricingSingleCard title="One plan" plan={plan} defaultYearly={false} />)
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
    expect(screen.getByText('24', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('renders a link for an href action and a button otherwise', () => {
    const onClick = vi.fn()
    const { rerender } = render(<PricingSingleCard title="One plan" plan={plan} />)
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/signup')
    rerender(<PricingSingleCard title="One plan" plan={{ ...plan, action: { label: 'Buy', onClick } }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
