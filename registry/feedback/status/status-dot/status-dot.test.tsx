import { render, screen } from '@testing-library/react'
import { StatusDot } from './status-dot'

describe('StatusDot', () => {
  it('is a status region labelled with the state name', () => {
    render(<StatusDot status="degraded" />)
    const el = screen.getByRole('status')
    expect(el).toHaveTextContent('Degraded')
    expect(el).toHaveAttribute('data-status', 'degraded')
  })

  it('replaces the default label with children', () => {
    render(<StatusDot status="online">All systems go</StatusDot>)
    expect(screen.getByRole('status')).toHaveTextContent('All systems go')
    expect(screen.queryByText('Online')).toBeNull()
  })

  it('colors the dot by state', () => {
    const { container, rerender } = render(<StatusDot status="online" />)
    expect(container.querySelector('[aria-hidden] > span:last-child')).toHaveClass('bg-success')
    rerender(<StatusDot status="offline" />)
    expect(container.querySelector('[aria-hidden] > span:last-child')).toHaveClass('bg-destructive')
  })

  it('hides the dot from screen readers and passes className through', () => {
    const { container } = render(<StatusDot status="maintenance" className="custom" />)
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass('custom')
  })
})
