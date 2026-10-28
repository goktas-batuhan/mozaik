import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { NavbarMega, type MegaItem } from './navbar-mega'

const items: MegaItem[] = [
  { label: 'Product', sections: [{ title: 'Build', links: [{ label: 'Editor', href: '/editor' }, { label: 'Automations', href: '/auto' }] }] },
  { label: 'Resources', sections: [{ title: 'Learn', links: [{ label: 'Docs', href: '/docs' }] }] },
  { label: 'Pricing', href: '/pricing' },
]

const setup = () =>
  render(
    <MotionConfig reducedMotion="always">
      <NavbarMega brand="Acme" items={items} openOnHover={false} />
    </MotionConfig>,
  )

describe('NavbarMega', () => {
  it('toggles a panel with the menu button and mirrors it in aria-expanded', () => {
    setup()
    const trigger = screen.getByRole('button', { name: 'Product' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Editor' })).toBeNull()
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Editor' })).toHaveAttribute('href', '/editor')
    fireEvent.click(trigger)
    expect(screen.queryByRole('link', { name: 'Editor' })).toBeNull()
  })

  it('ArrowDown opens the panel and moves focus to its first link', () => {
    setup()
    const trigger = screen.getByRole('button', { name: 'Product' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('link', { name: 'Editor' })).toHaveFocus()
  })

  it('walks the links with arrow keys and Escape returns focus to the trigger', () => {
    setup()
    const trigger = screen.getByRole('button', { name: 'Product' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByRole('link', { name: 'Editor' }), { key: 'ArrowDown' })
    expect(screen.getByRole('link', { name: 'Automations' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('link', { name: 'Automations' }), { key: 'Escape' })
    expect(screen.queryByRole('link', { name: 'Automations' })).toBeNull()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('ArrowRight and ArrowLeft move across the top level, wrapping around', () => {
    setup()
    const product = screen.getByRole('button', { name: 'Product' })
    product.focus()
    fireEvent.keyDown(product, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Resources' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('button', { name: 'Resources' }), { key: 'ArrowRight' })
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('link', { name: 'Pricing' }), { key: 'ArrowRight' })
    expect(product).toHaveFocus()
  })

  it('closes when the pointer goes down outside', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Product' }))
    expect(screen.getByRole('link', { name: 'Editor' })).toBeInTheDocument()
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('link', { name: 'Editor' })).toBeNull()
  })
})
