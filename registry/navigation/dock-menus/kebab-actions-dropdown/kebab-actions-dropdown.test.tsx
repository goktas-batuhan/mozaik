import { fireEvent, render, screen } from '@testing-library/react'
import { KebabActionsDropdown } from './kebab-actions-dropdown'

describe('KebabActionsDropdown', () => {
  it('starts closed and opens a menu from the kebab button', () => {
    render(<KebabActionsDropdown />)
    const trigger = screen.getByRole('button', { name: 'More actions' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).toBeNull()
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu', { name: 'Actions menu' })).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Edit', 'Copy link', 'Archive', 'Delete'])
  })

  it('focuses the first item on open and moves with the arrow keys', () => {
    render(<KebabActionsDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    const items = screen.getAllByRole('menuitem')
    expect(items[0]).toHaveFocus()
    fireEvent.keyDown(items[0], { key: 'ArrowDown' })
    expect(items[1]).toHaveFocus()
    items[0].focus()
    fireEvent.keyDown(items[0], { key: 'ArrowUp' })
    expect(items[3]).toHaveFocus()
    fireEvent.keyDown(items[3], { key: 'Home' })
    expect(items[0]).toHaveFocus()
  })

  it('calls onItemClick with the item and closes the menu', () => {
    const onItemClick = vi.fn()
    render(<KebabActionsDropdown onItemClick={onItemClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }))
    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'archive' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes on Escape and returns focus to the kebab button', () => {
    render(<KebabActionsDropdown />)
    const trigger = screen.getByRole('button', { name: 'More actions' })
    fireEvent.click(trigger)
    fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(trigger).toHaveFocus()
  })

  it('closes when the user presses outside', () => {
    render(<KebabActionsDropdown />)
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
