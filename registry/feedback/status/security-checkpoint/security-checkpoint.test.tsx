import { render, screen } from '@testing-library/react'
import { SecurityCheckpoint, type CheckpointLine } from './security-checkpoint'

describe('SecurityCheckpoint', () => {
  it('is a status region with the default heading and message', () => {
    render(<SecurityCheckpoint />)
    const region = screen.getByRole('status')
    expect(region).toHaveTextContent('Security Checkpoint')
    expect(region).toHaveTextContent('verify your browser')
  })

  it('takes a custom heading and message', () => {
    render(<SecurityCheckpoint title="Acme" subtitle="Verification" message="One moment." />)
    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Verification')).toBeInTheDocument()
    expect(screen.getByText('One moment.')).toBeInTheDocument()
  })

  it('draws a row for every blocked line and keeps the lines out of the accessibility tree', () => {
    const { container } = render(<SecurityCheckpoint />)
    expect(container.querySelectorAll('[data-slot="security-checkpoint-blocked-row"]')).toHaveLength(3)
    expect(container.querySelector('[data-slot="security-checkpoint-passing-lines"]')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[data-slot="security-checkpoint-blocked-lines"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('follows a custom set of lines', () => {
    const lines: CheckpointLine[] = [
      { id: 'a', color: 'destructive' },
      { id: 'b', color: 'primary' },
    ]
    const { container } = render(<SecurityCheckpoint lines={lines} />)
    expect(container.querySelectorAll('[data-slot="security-checkpoint-blocked-row"]')).toHaveLength(1)
  })

  it('reveals the card after mount', () => {
    const { container } = render(<SecurityCheckpoint />)
    expect(container.querySelector<HTMLElement>('[data-slot="security-checkpoint-card"]')?.style.opacity).toBe('1')
  })
})
