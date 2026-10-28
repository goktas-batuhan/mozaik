import { fireEvent, render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { NavbarMobile } from './navbar-mobile'

const links = [
  { label: 'Product', href: '/product', current: true },
  { label: 'Pricing', href: '/pricing' },
]

const setup = (props = {}) =>
  render(
    <MotionConfig reducedMotion="always">
      <NavbarMobile brand="Acme" links={links} action={{ label: 'Start', href: '/start' }} {...props} />
    </MotionConfig>,
  )

// Desktop copies of the links are always in the DOM (hidden by CSS), so the mobile ones are the menu's list.
const menu = () => document.querySelector('[id$="-menu"]') as HTMLElement

describe('NavbarMobile', () => {
  it('opens and closes with the menu button and keeps aria-expanded in sync', () => {
    setup()
    const button = screen.getByRole('button', { name: 'Open menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(menu().querySelectorAll('a')).toHaveLength(0)
    fireEvent.click(button)
    const close = screen.getByRole('button', { name: 'Close menu' })
    expect(close).toHaveAttribute('aria-expanded', 'true')
    expect(menu().querySelectorAll('a')).toHaveLength(3)
  })

  it('moves focus to the first link when opened and back to the button on Escape', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(menu().querySelector('a')).toHaveFocus()
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' })
    expect(menu().querySelectorAll('a')).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('keeps Tab inside the menu and the button', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const anchors = menu().querySelectorAll('a')
    const lastLink = anchors[anchors.length - 1] as HTMLElement
    lastLink.focus()
    fireEvent.keyDown(lastLink, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('button', { name: 'Close menu' }), { key: 'Tab' })
    expect(menu().querySelector('a')).toHaveFocus()
    fireEvent.keyDown(menu().querySelector('a') as HTMLElement, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
  })

  it('closes when a menu link is pressed and reports changes', () => {
    const onOpenChange = vi.fn()
    setup({ onOpenChange })
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    fireEvent.click(menu().querySelectorAll('a')[1] as HTMLElement)
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true)
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false)
  })

  it('can start open without taking focus', () => {
    setup({ defaultOpen: true })
    expect(menu().querySelectorAll('a')).toHaveLength(3)
    expect(menu().querySelector('a')).not.toHaveFocus()
  })
})
