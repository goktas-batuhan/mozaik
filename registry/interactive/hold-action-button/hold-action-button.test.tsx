import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { HoldActionButton } from './hold-action-button'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const fill = (c: HTMLElement) => c.querySelector('[data-hold-fill]') as HTMLElement

describe('HoldActionButton', () => {
  it('renders a real button with its label', () => {
    render(<HoldActionButton>Hold to delete</HoldActionButton>)
    const btn = screen.getByRole('button', { name: 'Hold to delete' })
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn.tagName).toBe('BUTTON')
  })

  it('completes after the duration and announces it', () => {
    const onComplete = vi.fn()
    render(
      <HoldActionButton duration={1} completeLabel="Deleted" onComplete={onComplete}>
        Hold
      </HoldActionButton>,
    )
    const btn = screen.getByRole('button')
    fireEvent.pointerDown(btn, { button: 0 })
    act(() => void vi.advanceTimersByTime(900))
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('')
    act(() => void vi.advanceTimersByTime(200))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Deleted')
  })

  it('rewinds and does not complete when released early', () => {
    const onComplete = vi.fn()
    const { container } = render(
      <HoldActionButton duration={1} onComplete={onComplete}>
        Hold
      </HoldActionButton>,
    )
    const btn = screen.getByRole('button')
    fireEvent.pointerDown(btn, { button: 0 })
    expect(fill(container).style.transform).toBe('scaleX(1)')
    act(() => void vi.advanceTimersByTime(500))
    fireEvent.pointerUp(btn)
    expect(fill(container).style.transform).toBe('scaleX(0)')
    act(() => void vi.advanceTimersByTime(2000))
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('can be held with Space and Enter, and ignores key repeat', () => {
    const onComplete = vi.fn()
    render(
      <HoldActionButton duration={1} onComplete={onComplete}>
        Hold
      </HoldActionButton>,
    )
    const btn = screen.getByRole('button')
    fireEvent.keyDown(btn, { key: ' ' })
    fireEvent.keyDown(btn, { key: ' ', repeat: true })
    act(() => void vi.advanceTimersByTime(1100))
    expect(onComplete).toHaveBeenCalledTimes(1)
    fireEvent.keyUp(btn, { key: ' ' })

    fireEvent.keyDown(btn, { key: 'Enter' })
    fireEvent.keyUp(btn, { key: 'Enter' })
    act(() => void vi.advanceTimersByTime(2000))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does nothing when disabled', () => {
    const onComplete = vi.fn()
    render(
      <HoldActionButton disabled duration={0.5} onComplete={onComplete}>
        Hold
      </HoldActionButton>,
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    fireEvent.keyDown(btn, { key: ' ' })
    act(() => void vi.advanceTimersByTime(1000))
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('under reduced motion the fill does not animate but the hold still completes', () => {
    const onComplete = vi.fn()
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <HoldActionButton duration={1} onComplete={onComplete}>
          Hold
        </HoldActionButton>
      </MotionConfig>,
    )
    const btn = screen.getByRole('button')
    fireEvent.pointerDown(btn, { button: 0 })
    expect(fill(container).style.transform).toBe('scaleX(0)')
    expect(fill(container).style.transition).toBe('none')
    act(() => void vi.advanceTimersByTime(1100))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(fill(container).style.transform).toBe('scaleX(1)')
  })
})
