import { fireEvent, render, screen } from '@testing-library/react'
import { HeroDashboardPeek } from './hero-dashboard-peek'

describe('HeroDashboardPeek', () => {
  it('renders the headline and description', () => {
    render(<HeroDashboardPeek title="Control your money" description="One calm screen" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Control your money' })).toBeInTheDocument()
    expect(screen.getByText('One calm screen')).toBeInTheDocument()
  })

  it('renders the announcement as a link when it has an href', () => {
    render(<HeroDashboardPeek title="T" announcement={{ tag: 'New', text: 'Budgets 2.0', href: '/news' }} />)
    expect(screen.getByRole('link', { name: /Budgets 2\.0/ })).toHaveAttribute('href', '/news')
  })

  it('wires up both calls to action', () => {
    const onClick = vi.fn()
    render(<HeroDashboardPeek title="T" primaryAction={{ label: 'Open', href: '/open' }} secondaryAction={{ label: 'Tour', onClick }} />)
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('href', '/open')
    fireEvent.click(screen.getByRole('button', { name: 'Tour' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('draws the figures you pass in and hides the mock dashboard from assistive tech', () => {
    render(<HeroDashboardPeek title="T" kpis={[{ label: 'MRR', value: '$5k', change: '+2%' }]} bars={[10, 50]} />)
    expect(screen.getByText('$5k').closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('replaces the dashboard with custom media', () => {
    render(<HeroDashboardPeek title="T" media={<img alt="Shot" />} />)
    expect(screen.getByAltText('Shot')).toBeInTheDocument()
    expect(screen.queryByText('Balance')).not.toBeInTheDocument()
  })
})
