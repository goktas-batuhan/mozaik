import { act, fireEvent, render, screen } from '@testing-library/react'
import { ProfileDropdown } from './profile-dropdown'

const trigger = () => screen.getByRole('button', { name: /Maya Ortega/ })
const mainMenu = () => screen.getByRole('menu', { name: 'Maya Ortega' })

describe('ProfileDropdown', () => {
  it('shows the account in a collapsed trigger and opens a labelled menu', () => {
    render(<ProfileDropdown />)
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(mainMenu()).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Billing/ })).toBeInTheDocument()
  })

  it('moves focus with the arrow keys and closes on Escape, returning focus to the trigger', () => {
    render(<ProfileDropdown />)
    fireEvent.click(trigger())
    // A keyboard open lands on the first item.
    const first = document.activeElement as HTMLElement
    expect(first).toHaveAttribute('data-menu-item')
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(document.activeElement).not.toBe(first)
    expect(document.activeElement).toHaveAttribute('data-menu-item')
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(trigger()).toHaveFocus()
  })

  it('opens with ArrowDown on the trigger', () => {
    render(<ProfileDropdown />)
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' })
    expect(mainMenu()).toBeInTheDocument()
  })

  it('changes theme and status through radio items', () => {
    const onThemeChange = vi.fn()
    const onStatusChange = vi.fn()
    render(<ProfileDropdown onThemeChange={onThemeChange} onStatusChange={onStatusChange} />)
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
    expect(onThemeChange).toHaveBeenCalledWith('dark')
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Away' }))
    expect(onStatusChange).toHaveBeenCalledWith('away')
  })

  it('switches account on a second page and reports the change', () => {
    const onAccountChange = vi.fn()
    render(<ProfileDropdown onAccountChange={onAccountChange} />)
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('menuitem', { name: 'Switch account' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /Fieldwork Studio/ }))
    expect(onAccountChange).toHaveBeenCalledWith(expect.objectContaining({ id: 'studio' }))
    expect(screen.getByRole('menu', { name: 'Fieldwork Studio' })).toBeInTheDocument()
  })

  describe('hold to sign out', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('signs out only after the key is held for the full duration', () => {
      const onSignOut = vi.fn()
      render(<ProfileDropdown holdDuration={500} onSignOut={onSignOut} />)
      fireEvent.click(trigger())
      const signOut = screen.getByRole('menuitem', { name: /Sign out/ })

      fireEvent.keyDown(signOut, { key: 'Enter' })
      act(() => void vi.advanceTimersByTime(300))
      fireEvent.keyUp(signOut, { key: 'Enter' })
      act(() => void vi.advanceTimersByTime(600))
      expect(onSignOut).not.toHaveBeenCalled()

      fireEvent.keyDown(signOut, { key: 'Enter' })
      act(() => void vi.advanceTimersByTime(500))
      expect(onSignOut).toHaveBeenCalledTimes(1)
    })
  })
})
