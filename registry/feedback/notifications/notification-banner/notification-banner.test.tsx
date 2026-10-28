import { act, fireEvent, render, screen } from '@testing-library/react'
import { NotificationBanner } from './notification-banner'

describe('NotificationBanner', () => {
  afterEach(() => vi.useRealTimers())

  it('is a status region with the message, action and dismiss button', () => {
    render(<NotificationBanner message="Draft saved" />)
    expect(screen.getByRole('status')).toHaveTextContent('Draft saved')
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('fires onAction without closing', () => {
    const onAction = vi.fn()
    render(<NotificationBanner onAction={onAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveAttribute('data-phase', 'open')
  })

  it('hides the action button when actionLabel is empty', () => {
    render(<NotificationBanner actionLabel="" />)
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull()
  })

  it('closes after the exit time and leaves a button that brings it back', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    const onShow = vi.fn()
    render(<NotificationBanner onDismiss={onDismiss} onShow={onShow} showTriggerLabel="Bring back" />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveAttribute('data-phase', 'closing')
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Bring back' }))
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveAttribute('data-phase', 'open')
  })
})
