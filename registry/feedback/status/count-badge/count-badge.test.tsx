import { render, screen } from '@testing-library/react'
import { CountBadge } from './count-badge'

describe('CountBadge', () => {
  it('shows the count variant with a readable unread label', () => {
    render(
      <CountBadge variant="count" count={5}>
        <button type="button">Inbox</button>
      </CountBadge>,
    )
    expect(screen.getByText('5 unread')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inbox' })).toBeInTheDocument()
  })

  it('caps the number at max', () => {
    render(<CountBadge variant="count" count={150} max={99} />)
    expect(screen.getByText('99+ unread')).toBeInTheDocument()
  })

  it('hides a zero count unless showZero is set', () => {
    const { container, rerender } = render(<CountBadge variant="count" count={0} />)
    expect(container.querySelector('[data-slot="count-badge"]')).toBeNull()
    rerender(<CountBadge variant="count" count={0} showZero />)
    expect(container.querySelector('[data-slot="count-badge"]')).toBeInTheDocument()
  })

  it('names the presence for the status variant', () => {
    render(<CountBadge variant="status" status="busy" />)
    expect(screen.getByText('Busy')).toBeInTheDocument()
  })

  it('always shows the dot variant at the chosen corner', () => {
    const { container } = render(<CountBadge position="bottom-left" />)
    const dot = container.querySelector('[data-slot="count-badge"]')
    expect(dot).toHaveAttribute('data-variant', 'dot')
    expect(dot).toHaveClass('-bottom-1', '-left-1')
  })
})
