// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface NavbarMobileLink {
  label: string
  href: string
  current?: boolean
}

export interface NavbarMobileProps {
  brand: ReactNode
  links: NavbarMobileLink[]
  action?: { label: string; href: string }
  /** Accessible name of the nav landmark. */
  label?: string
  /** Starts with the menu open. */
  defaultOpen?: boolean
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Seconds the menu takes to slide open. */
  duration?: number
  as?: ElementType
  className?: string
}

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const focusable = 'a[href], button:not([disabled])'

/**
 * Top bar that folds into a menu button on narrow containers. The open menu moves focus to its first link,
 * keeps Tab inside the menu and the button, closes on Escape or a link press, and gives focus back to the button.
 */
export function NavbarMobile({
  brand,
  links,
  action,
  label = 'Main',
  defaultOpen = false,
  onOpenChange,
  duration = 0.25,
  as: Tag = 'header',
  className,
}: NavbarMobileProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpenState] = useState(defaultOpen)
  // True once the visitor has toggled the menu; focus only moves after that.
  const toggled = useRef(false)

  const setOpen = (next: boolean) => {
    toggled.current = true
    setOpenState(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!toggled.current) return
    if (open) menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    else buttonRef.current?.focus()
  }, [open])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open) return
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key !== 'Tab') return
    // The cycle is the menu links followed by the button, so Tab never leaves for the page behind.
    const ring = [...(menuRef.current?.querySelectorAll<HTMLElement>(focusable) ?? []), buttonRef.current].filter(
      (el): el is HTMLElement => el != null,
    )
    const at = ring.indexOf(document.activeElement as HTMLElement)
    const next = event.shiftKey ? (at <= 0 ? ring.length - 1 : at - 1) : at === ring.length - 1 ? 0 : at + 1
    if (at === -1) return
    event.preventDefault()
    ring[next]?.focus()
  }

  return (
    <Tag
      ref={rootRef}
      onKeyDown={onKeyDown}
      className={cn('@container relative z-40 w-full border-b border-border bg-background text-foreground', className)}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <a href="/" className={cn('rounded-sm text-lg font-semibold tracking-tight', focus)}>
          {brand}
        </a>
        <nav aria-label={label} className="hidden flex-1 @2xl:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    link.current ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                    focus,
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {action && (
          <a
            href={action.href}
            className={cn('ml-auto hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 @2xl:block', focus)}
          >
            {action.label}
          </a>
        )}
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
          className={cn('ml-auto flex size-10 items-center justify-center rounded-md border border-border @2xl:hidden', focus)}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      <div id={`${id}-menu`} ref={menuRef} className="@2xl:hidden">
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration }}
            className="absolute inset-x-0 top-full border-b border-border bg-background px-6 pt-2 pb-6 shadow-lg shadow-foreground/5"
          >
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={link.current ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-md px-3 py-3 text-base',
                      link.current ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground',
                      focus,
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {action && (
              <a
                href={action.href}
                onClick={() => setOpen(false)}
                className={cn('mt-4 block rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground', focus)}
              >
                {action.label}
              </a>
            )}
          </motion.div>
        )}
      </div>
    </Tag>
  )
}
