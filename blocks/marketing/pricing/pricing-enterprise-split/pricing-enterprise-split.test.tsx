import { fireEvent, render, screen } from '@testing-library/react'
import { PricingEnterpriseSplit } from './pricing-enterprise-split'

const enterprise = {
  name: 'Enterprise',
  description: 'Custom',
  features: ['SSO', 'Audit log'],
  action: { label: 'Talk to sales', href: '/sales' },
  note: 'Reply in a day',
}

describe('PricingEnterpriseSplit', () => {
  it('shows both columns under a labelled section', () => {
    render(<PricingEnterpriseSplit title="Plans" plans={[{ name: 'Pro', description: 'd', price: '$19' }]} enterprise={enterprise} />)
    expect(screen.getByRole('region', { name: 'Plans' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Enterprise' })).toBeInTheDocument()
    expect(screen.getByText('$19')).toBeInTheDocument()
  })

  it('gives each self-serve button the name of its plan', () => {
    render(
      <PricingEnterpriseSplit
        title="Plans"
        plans={[
          { name: 'Free', description: 'a', price: '$0', href: '/free' },
          { name: 'Pro', description: 'b', price: '$19' },
        ]}
        enterprise={enterprise}
      />,
    )
    expect(screen.getByRole('link', { name: 'Choose Free' })).toHaveAttribute('href', '/free')
    expect(screen.getByRole('button', { name: 'Choose Pro' })).toBeInTheDocument()
  })

  it('calls onClick for a button plan', () => {
    const onClick = vi.fn()
    render(<PricingEnterpriseSplit title="Plans" plans={[{ name: 'Pro', description: 'b', price: '$19', onClick }]} enterprise={enterprise} />)
    fireEvent.click(screen.getByRole('button', { name: 'Choose Pro' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('links the sales call to action and prints the note', () => {
    render(<PricingEnterpriseSplit title="Plans" plans={[]} enterprise={enterprise} />)
    expect(screen.getByRole('link', { name: 'Talk to sales' })).toHaveAttribute('href', '/sales')
    expect(screen.getByText('Reply in a day')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
