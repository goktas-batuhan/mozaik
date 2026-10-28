import { fireEvent, render, screen } from '@testing-library/react'
import { PricingLifetimeDeal } from './pricing-lifetime-deal'

const base = {
  title: 'Lifetime',
  price: 149,
  sold: 300,
  total: 500,
  features: ['Updates', 'Support'],
  action: { label: 'Claim', href: '/claim' },
}

describe('PricingLifetimeDeal', () => {
  it('labels the section and lists the features', () => {
    render(<PricingLifetimeDeal {...base} />)
    expect(screen.getByRole('region', { name: 'Lifetime' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('reports how many licences are left through a progress bar', () => {
    render(<PricingLifetimeDeal {...base} />)
    const bar = screen.getByRole('progressbar', { name: 'Licences sold' })
    expect(bar).toHaveAttribute('aria-valuenow', '300')
    expect(bar).toHaveAttribute('aria-valuemax', '500')
    expect(screen.getByText(/licences left/)).toHaveTextContent('200 of 500 licences left')
  })

  it('never reports a negative number of licences left', () => {
    render(<PricingLifetimeDeal {...base} sold={600} />)
    expect(screen.getByText(/licences left/)).toHaveTextContent('0 of 500 licences left')
  })

  it('shows the regular price for screen readers and handles clicks', () => {
    const onClick = vi.fn()
    render(<PricingLifetimeDeal {...base} originalPrice={399} action={{ label: 'Claim', onClick }} />)
    expect(screen.getByText('Regular price')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Claim' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
