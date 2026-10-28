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

export interface MegaLink {
  label: string
  href: string
  /** One line under the label. */
  description?: string
}

export interface MegaSection {
  title: string
  links: MegaLink[]
}

export interface MegaItem {
  label: string
  /** A plain link when there is no panel. */
  href?: string
  /** Sections of the mega panel. Items with sections render a menu button. */
  sections?: MegaSection[]
  /** Extra content on the right of the panel, e.g. a featured card. */
  featured?: ReactNode
}

export interface NavbarMegaProps {
  brand: ReactNode
  items: MegaItem[]
  action?: { label: string; href: string }
  /** Accessible name of the nav landmark. */
  label?: string
  /** Opens panels on mouse hover as well as on click. */
  openOnHover?: boolean
  /** Seconds the panel takes to fade in. */
  duration?: number
  as?: ElementType
  className?: string
}

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const chevron = (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 6l4 4 4-4" />
  </svg>
)

/**
 * Top bar with mega-menu panels and its own focus management: Enter/Space/ArrowDown open a panel and move into it,
 * ArrowLeft/Right walk the top level, Arrow keys walk the links, Escape closes and returns to the trigger,
 * and tabbing or clicking away closes it.
 */
export function NavbarMega({
  brand,
  items,
  action,
  label = 'Main',
  openOnHover = true,
  duration = 0.18,
  as: Tag = 'header',
  className,
}: NavbarMegaProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const topRefs = useRef<(HTMLElement | null)[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  // Set when a key opens the panel so focus moves in once it is mounted.
  const [focusPanel, setFocusPanel] = useState(false)

  useEffect(() => {
    if (open !== null && focusPanel) {
      panelRef.current?.querySelector<HTMLElement>('a')?.focus()
      setFocusPanel(false)
    }
  }, [open, focusPanel])

  useEffect(() => {
    if (open === null) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const focusTop = (index: number) => {
    const count = items.length
    topRefs.current[((index % count) + count) % count]?.focus()
  }

  const onTopKeyDown = (event: KeyboardEvent<HTMLElement>, index: number, hasPanel: boolean) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        focusTop(index + 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        focusTop(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTop(0)
        break
      case 'End':
        event.preventDefault()
        focusTop(items.length - 1)
        break
      case 'ArrowDown':
        if (hasPanel) {
          event.preventDefault()
          setOpen(index)
          setFocusPanel(true)
        }
        break
      case 'Escape':
        if (open !== null) {
          event.preventDefault()
          setOpen(null)
        }
        break
    }
  }

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a'))
    const at = links.indexOf(document.activeElement as HTMLElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      const index = open
      setOpen(null)
      if (index !== null) topRefs.current[index]?.focus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      links[(at + 1) % links.length]?.focus()
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      if (at <= 0 && open !== null) topRefs.current[open]?.focus()
      else links[at - 1]?.focus()
    }
  }

  const active = open !== null ? items[open] : null

  return (
    <Tag
      ref={rootRef}
      className={cn('@container relative z-40 w-full border-b border-border bg-background text-foreground', className)}
      onPointerLeave={(event: React.PointerEvent) => {
        if (openOnHover && event.pointerType === 'mouse') setOpen(null)
      }}
      onBlur={(event: React.FocusEvent) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(null)
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <a href="/" className={cn('rounded-sm text-lg font-semibold tracking-tight', focus)}>
          {brand}
        </a>
        <nav aria-label={label} className="flex-1">
          <ul className="flex items-center gap-1">
            {items.map((item, index) => {
              const hasPanel = Boolean(item.sections?.length)
              const expanded = open === index
              const base = cn(
                'flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors',
                expanded ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                focus,
              )
              return (
                <li
                  key={item.label}
                  onPointerEnter={(event) => {
                    if (openOnHover && event.pointerType === 'mouse') setOpen(hasPanel ? index : null)
                  }}
                >
                  {hasPanel ? (
                    <button
                      type="button"
                      ref={(el) => {
                        topRefs.current[index] = el
                      }}
                      aria-expanded={expanded}
                      aria-controls={`${id}-panel`}
                      className={base}
                      onClick={() => setOpen(expanded ? null : index)}
                      onKeyDown={(event) => onTopKeyDown(event, index, true)}
                    >
                      {item.label}
                      {chevron}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      ref={(el) => {
                        topRefs.current[index] = el
                      }}
                      className={base}
                      onKeyDown={(event) => onTopKeyDown(event, index, false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        {action && (
          <a
            href={action.href}
            className={cn('rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90', focus)}
          >
            {action.label}
          </a>
        )}
      </div>
      {active?.sections && (
        <motion.div
          key={open}
          id={`${id}-panel`}
          ref={panelRef}
          role="group"
          aria-label={active.label}
          initial={reduced ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
          onKeyDown={onPanelKeyDown}
          className="absolute inset-x-0 top-full border-b border-border bg-background shadow-lg shadow-foreground/5"
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 @3xl:grid-cols-[1fr_1fr_minmax(0,0.9fr)]">
            {active.sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{section.title}</h3>
                <ul className="flex flex-col gap-1">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={cn('block rounded-lg p-2 transition-colors hover:bg-muted', focus)}>
                        <span className="block text-sm font-medium">{link.label}</span>
                        {link.description && <span className="block text-xs text-muted-foreground">{link.description}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {active.featured != null && <div className="hidden @3xl:block">{active.featured}</div>}
          </div>
        </motion.div>
      )}
    </Tag>
  )
}
