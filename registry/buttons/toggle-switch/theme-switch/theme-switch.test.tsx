import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeSwitch } from './theme-switch'

describe('ThemeSwitch', () => {
  it('is a switch named for dark mode and starts light', () => {
    render(<ThemeSwitch />)
    const control = screen.getByRole('switch', { name: 'Dark mode' })
    expect(control).toHaveAttribute('aria-checked', 'false')
    expect(control).toHaveAttribute('data-theme', 'light')
  })

  it('toggles and reports the theme to switch to', () => {
    const onThemeChange = vi.fn()
    render(<ThemeSwitch onThemeChange={onThemeChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onThemeChange).toHaveBeenLastCalledWith('dark')
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByRole('switch'))
    expect(onThemeChange).toHaveBeenLastCalledWith('light')
  })

  it('is controlled by theme', () => {
    const onThemeChange = vi.fn()
    const { rerender } = render(<ThemeSwitch theme="light" onThemeChange={onThemeChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onThemeChange).toHaveBeenCalledWith('dark')
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
    rerender(<ThemeSwitch theme="dark" onThemeChange={onThemeChange} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('does not touch the document theme', () => {
    render(<ThemeSwitch />)
    fireEvent.click(screen.getByRole('switch'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('shows a visible label that replaces the aria-label', () => {
    render(<ThemeSwitch showLabel defaultTheme="dark" />)
    expect(screen.getByRole('switch', { name: 'Dark' })).toBeInTheDocument()
  })
})
