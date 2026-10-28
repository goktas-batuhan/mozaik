import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MarkingMenu } from './marking-menu'

const surfaceOf = (container: HTMLElement) => container.firstElementChild as HTMLElement

describe('MarkingMenu', () => {
  it('opens a menu of eight items from the Menu button', () => {
    render(<MarkingMenu />)
    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const menu = screen.getByRole('menu', { name: 'Go to' })
    expect(menu).toHaveFocus()
    expect(screen.getAllByRole('menuitem').map((el) => el.getAttribute('aria-label'))).toEqual([
      'Home',
      'Inbox',
      'Calendar',
      'Files',
      'Search',
      'Compose',
      'Profile',
      'Settings',
    ])
  })

  it('walks the ring with arrow keys and picks with Enter', async () => {
    const onSelect = vi.fn()
    render(<MarkingMenu onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    const menu = screen.getByRole('menu')
    expect(menu).toHaveAttribute('aria-activedescendant', expect.stringMatching(/-home$/))
    fireEvent.keyDown(menu, { key: 'ArrowRight' })
    expect(menu).toHaveAttribute('aria-activedescendant', expect.stringMatching(/-inbox$/))
    fireEvent.keyDown(menu, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'inbox' }))
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })

  it('picks by number key and closes on Escape with focus back on the button', async () => {
    const onSelect = vi.fn()
    render(<MarkingMenu onSelect={onSelect} />)
    const button = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(button)
    fireEvent.keyDown(screen.getByRole('menu'), { key: '3' })
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'calendar' }))
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    fireEvent.click(button)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(button).toHaveFocus()
  })

  it('picks by direction when the pointer flicks before the menu shows', () => {
    const onSelect = vi.fn()
    const { container } = render(<MarkingMenu onSelect={onSelect} />)
    const surface = surfaceOf(container)
    fireEvent.pointerDown(surface, { pointerId: 1, button: 0, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(surface, { pointerId: 1, clientX: 170, clientY: 100 })
    fireEvent.pointerUp(surface, { pointerId: 1, clientX: 170, clientY: 100 })
    // Straight right is the third slice, clockwise from the top.
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'calendar' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens a sticky menu on right click', () => {
    const { container } = render(<MarkingMenu />)
    fireEvent.contextMenu(surfaceOf(container), { clientX: 120, clientY: 120 })
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })
})
