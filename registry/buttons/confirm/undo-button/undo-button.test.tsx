import { act, fireEvent, render, screen } from '@testing-library/react'
import { UndoButton } from './undo-button'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('UndoButton', () => {
  it('acts at once and opens an undo window', () => {
    const onAction = vi.fn()
    render(<UndoButton onAction={onAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).toHaveAttribute('data-phase', 'pending')
    expect(screen.getByRole('button')).toHaveAccessibleName(/Undo, 5 seconds left/)
  })

  it('commits when the window closes without an undo', () => {
    const onCommit = vi.fn()
    render(<UndoButton duration={1000} resetAfter={null} onCommit={onCommit} />)
    fireEvent.click(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(1000))
    expect(onCommit).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).toHaveAttribute('data-phase', 'done')
  })

  it('undoes on a second click and never commits', () => {
    const onUndo = vi.fn()
    const onCommit = vi.fn()
    render(<UndoButton duration={1000} onUndo={onUndo} onCommit={onCommit} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(2000))
    expect(onUndo).toHaveBeenCalledTimes(1)
    expect(onCommit).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toHaveAttribute('data-phase', 'idle')
  })

  it('undoes with Ctrl+Z', () => {
    const onUndo = vi.fn()
    render(<UndoButton onUndo={onUndo} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true })
    expect(onUndo).toHaveBeenCalledTimes(1)
  })

  it('pauses the clock while a mouse hovers the button', () => {
    const onCommit = vi.fn()
    render(<UndoButton duration={1000} onCommit={onCommit} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.pointerEnter(button, { pointerType: 'mouse' })
    act(() => void vi.advanceTimersByTime(3000))
    expect(onCommit).not.toHaveBeenCalled()
    fireEvent.pointerLeave(button, { pointerType: 'mouse' })
    act(() => void vi.advanceTimersByTime(1000))
    expect(onCommit).toHaveBeenCalledTimes(1)
  })
})
