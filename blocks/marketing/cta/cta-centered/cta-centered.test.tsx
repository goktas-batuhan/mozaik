import { fireEvent, render, screen } from '@testing-library/react'
import { CtaCentered } from './cta-centered'

describe('CtaCentered', () => {
  it('renders the headline as an h2 with its description', () => {
    render(<CtaCentered title="Build today" description="Free and open" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Build today' })).toBeInTheDocument()
    expect(screen.getByText('Free and open')).toBeInTheDocument()
  })

  it('renders a link for an action with href', () => {
    render(<CtaCentered title="T" primaryAction={{ label: 'Start', href: '/start' }} />)
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start')
  })

  it('renders a button and fires its click when there is no href', () => {
    const onClick = vi.fn()
    render(<CtaCentered title="T" secondaryAction={{ label: 'More', onClick }} />)
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders no action row when no actions are given', () => {
    render(<CtaCentered title="T" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
