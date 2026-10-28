import { act, fireEvent, render, screen } from '@testing-library/react'
import { Tooltip } from './tooltip'

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('is hidden until the trigger is focused', () => {
    render(
      <Tooltip content="Copy">
        <button>Trigger</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.focus(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(0))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy')
  })

  it('describes the trigger while open', () => {
    render(
      <Tooltip content="Copy">
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.focus(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(0))
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Copy')
  })

  it('waits for the delay on hover', () => {
    render(
      <Tooltip content="Copy" delay={0.5}>
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.pointerEnter(screen.getByRole('button').parentElement as Element)
    act(() => void vi.advanceTimersByTime(300))
    expect(screen.queryByRole('tooltip')).toBeNull()
    act(() => void vi.advanceTimersByTime(250))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  it('hides on Escape', () => {
    render(
      <Tooltip content="Copy">
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.focus(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(0))
    fireEvent.keyDown(document, { key: 'Escape' })
    act(() => void vi.advanceTimersByTime(500))
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
  })

  it('never shows when disabled', () => {
    render(
      <Tooltip content="Copy" disabled>
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.focus(screen.getByRole('button'))
    act(() => void vi.advanceTimersByTime(1000))
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
})
