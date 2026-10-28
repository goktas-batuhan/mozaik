import { fireEvent, render, screen } from '@testing-library/react'
import { CtaBanner } from './cta-banner'

describe('CtaBanner', () => {
  it('renders the title as an h2 with a description', () => {
    render(<CtaBanner title="Start today" description="One command" actionLabel="Go" disabled />)
    expect(screen.getByRole('heading', { level: 2, name: 'Start today' })).toBeInTheDocument()
    expect(screen.getByText('One command')).toBeInTheDocument()
  })

  it('renders a link when actionHref is set', () => {
    render(<CtaBanner title="T" actionLabel="Go" actionHref="/go" disabled />)
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go')
  })

  it('renders a button that fires onAction otherwise', () => {
    const onAction = vi.fn()
    render(<CtaBanner title="T" actionLabel="Go" onAction={onAction} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('hides the arrow icon from assistive tech', () => {
    const { container } = render(<CtaBanner title="T" actionLabel="Go" disabled />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
