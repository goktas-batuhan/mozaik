import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { AIToolApproval } from './ai-tool-approval'

describe('AIToolApproval', () => {
  it('renders the call with real buttons', () => {
    render(<AIToolApproval tool="bash" title="Run a command" input="npm test" reason="Check it." />)
    expect(screen.getByRole('region', { name: 'Run a command' })).toBeInTheDocument()
    expect(screen.getByText('npm test')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve' }).tagName).toBe('BUTTON')
    expect(screen.getByRole('button', { name: 'Deny' }).tagName).toBe('BUTTON')
  })

  it('renders object input as labelled fields', () => {
    render(<AIToolApproval tool="write_file" title="Edit a file" input={{ path: 'a.tsx', changes: '+4 -2' }} />)
    expect(screen.getByText('path')).toBeInTheDocument()
    expect(screen.getByText('a.tsx')).toBeInTheDocument()
  })

  it('approves and announces the decision', async () => {
    const onApprove = vi.fn()
    render(<AIToolApproval tool="bash" title="Run a command" input="ls" onApprove={onApprove} />)
    const approve = screen.getByRole('button', { name: 'Approve' })
    approve.focus()
    expect(approve).toHaveFocus()
    fireEvent.click(approve)
    expect(onApprove).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toHaveTextContent('Approved: Run a command')
  })

  it('denies and announces the decision', () => {
    const onDeny = vi.fn()
    render(<AIToolApproval tool="bash" title="Run a command" input="ls" onDeny={onDeny} />)
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }))
    expect(onDeny).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toHaveTextContent('Denied: Run a command')
  })

  it('disables both buttons', () => {
    render(<AIToolApproval tool="bash" title="Run a command" input="ls" disabled />)
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Deny' })).toBeDisabled()
  })

  it('shows the card fully visible under reduced motion', () => {
    render(
      <MotionConfig reducedMotion="always">
        <AIToolApproval tool="bash" title="Run a command" input="ls" />
      </MotionConfig>,
    )
    const card = screen.getByRole('region')
    expect(card.style.opacity === '' || card.style.opacity === '1').toBe(true)
  })
})
