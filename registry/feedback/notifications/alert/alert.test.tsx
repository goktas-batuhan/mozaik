import { render, screen } from '@testing-library/react'
import { Alert } from './alert'

describe('Alert', () => {
  it('renders the title and the body', () => {
    render(<Alert title="Heads up">Your trial ends tomorrow.</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Your trial ends tomorrow.')).toBeInTheDocument()
  })

  it('is a polite status by default and for success', () => {
    const { rerender } = render(<Alert title="Note" />)
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'info')
    rerender(<Alert title="Saved" variant="success" />)
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'success')
  })

  it('interrupts with role alert for warning and destructive', () => {
    const { rerender } = render(<Alert title="Low balance" variant="warning" />)
    expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'warning')
    rerender(<Alert title="Payment failed" variant="destructive" />)
    expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'destructive')
  })

  it('hides the icon from screen readers and omits empty parts', () => {
    const { container } = render(<Alert icon={<svg data-testid="i" />}>Body</Alert>)
    expect(container.querySelector('[data-slot="alert-icon"]')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[data-slot="alert-title"]')).toBeNull()
  })
})
