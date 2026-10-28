import { act, fireEvent, render, screen } from '@testing-library/react'
import { UnlockFaceId } from './unlock-face-id'

describe('UnlockFaceId', () => {
  afterEach(() => vi.useRealTimers())

  it('starts idle with a labelled trigger and a status message', () => {
    render(<UnlockFaceId />)
    expect(screen.getByRole('button', { name: 'Scan to unlock' })).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Ready to scan.')
  })

  it('scans, then unlocks when the scan duration passes', () => {
    vi.useFakeTimers()
    const onScan = vi.fn()
    const onComplete = vi.fn()
    render(<UnlockFaceId scanDuration={1000} onScan={onScan} onComplete={onComplete} />)
    const button = screen.getByRole('button', { name: 'Scan to unlock' })
    fireEvent.click(button)
    expect(onScan).toHaveBeenCalledTimes(1)
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Scanning face')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Identity confirmed')
  })

  it('shows the error message from a controlled status and lets the user retry', () => {
    const onScan = vi.fn()
    render(<UnlockFaceId status="error" errorMessage="No match." onScan={onScan} />)
    expect(screen.getByRole('status')).toHaveTextContent('No match.')
    fireEvent.click(screen.getByRole('button', { name: 'Scan to unlock' }))
    expect(onScan).toHaveBeenCalledTimes(1)
  })

  it('does not run its own scan when the status is controlled', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<UnlockFaceId status="idle" onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Scan to unlock' }))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('Ready to scan.')
  })

  it('keeps the gated content inert until unlocked', () => {
    const { rerender } = render(
      <UnlockFaceId status="idle">
        <p>Secret balance</p>
      </UnlockFaceId>,
    )
    expect(screen.getByText('Secret balance').parentElement).toHaveClass('pointer-events-none')
    rerender(
      <UnlockFaceId status="success">
        <p>Secret balance</p>
      </UnlockFaceId>,
    )
    expect(screen.getByText('Secret balance').parentElement).not.toHaveClass('pointer-events-none')
  })
})
