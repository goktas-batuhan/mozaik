import { act, fireEvent, render, screen } from '@testing-library/react'
import { DoubleTapButton } from './double-tap-button'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('DoubleTapButton', () => {
  it('arms on the first press without confirming', () => {
    const onConfirm = vi.fn()
    render(<DoubleTapButton onConfirm={onConfirm}>Delete</DoubleTapButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toHaveAttribute('data-armed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Press again to confirm')
  })

  it('confirms on the second press and disarms', () => {
    const onConfirm = vi.fn()
    render(<DoubleTapButton onConfirm={onConfirm}>Delete</DoubleTapButton>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).not.toHaveAttribute('data-armed')
  })

  it('disarms when the window runs out', () => {
    const onConfirm = vi.fn()
    render(<DoubleTapButton window={1500} onConfirm={onConfirm}>Delete</DoubleTapButton>)
    fireEvent.click(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(1500))
    expect(screen.getByRole('button')).not.toHaveAttribute('data-armed')
    fireEvent.click(screen.getByRole('button'))
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('disarms when focus leaves the button', () => {
    render(<DoubleTapButton>Delete</DoubleTapButton>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.blur(screen.getByRole('button'))
    expect(screen.getByRole('button')).not.toHaveAttribute('data-armed')
  })

  it('does nothing when disabled', () => {
    const onConfirm = vi.fn()
    render(<DoubleTapButton disabled onConfirm={onConfirm}>Delete</DoubleTapButton>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
