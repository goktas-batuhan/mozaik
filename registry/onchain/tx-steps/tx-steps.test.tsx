import { render, screen, within } from '@testing-library/react'
import { TxSteps, type TxStep } from './tx-steps'

const steps: TxStep[] = [
  { label: 'Approve', status: 'done' },
  { label: 'Sign', description: 'Confirm in your wallet', status: 'active' },
  { label: 'Broadcast', status: 'pending' },
]

describe('TxSteps', () => {
  it('renders an ordered list with status text for screen readers', () => {
    render(<TxSteps steps={steps} />)
    const list = screen.getByRole('list', { name: 'Transaction progress' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('Approve, completed')
    expect(items[2]).toHaveTextContent('Broadcast, pending')
    expect(screen.getByText('Confirm in your wallet')).toBeInTheDocument()
  })

  it('marks the active step as current', () => {
    render(<TxSteps steps={steps} />)
    const items = screen.getAllByRole('listitem')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[0]).not.toHaveAttribute('aria-current')
  })

  it('shows a failed step as current and failed', () => {
    render(<TxSteps steps={[{ label: 'Approve', status: 'done' }, { label: 'Sign', status: 'error' }]} />)
    const items = screen.getAllByRole('listitem')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[1]).toHaveTextContent('Sign, failed')
    expect(items[1].querySelector('[data-status="error"]')).not.toBeNull()
  })

  it('switches orientation', () => {
    render(<TxSteps steps={steps} orientation="horizontal" label="Swap" />)
    expect(screen.getByRole('list', { name: 'Swap' })).toHaveAttribute('data-orientation', 'horizontal')
  })
})
