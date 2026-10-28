// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface NavbarFloatingLink {
  label: string
  href: string
  current?: boolean
}

export interface NavbarFloatingProps {
  /** Logo or wordmark at the start of the pill. */
  brand: ReactNode
  links: NavbarFloatingLink[]
  /** Call to action at the end of the pill. */
  action?: { label: string; href: string }
  /** Accessible name of the nav landmark. */
  label?: string
  /** Seconds the pill takes to settle in on mount. */
  duration?: number
  /** Turns the entrance off. */
  disabled?: boolean
  as?: ElementType
  className?: string
}

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** A rounded pill that floats inset from the top of its container, centred, with a soft shadow and blurred backdrop. */
export function NavbarFloating({
  brand,
  links,
  action,
  label = 'Main',
  duration = 0.5,
  disabled = false,
  as: Tag = 'header',
  className,
}: NavbarFloatingProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag className={cn('@container pointer-events-none w-full px-4 pt-4 text-foreground', className)}>
      <motion.div
        initial={animate ? { opacity: 0, y: -12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-4 rounded-full border border-border bg-background/70 py-2 pr-2 pl-5 shadow-lg shadow-foreground/5 backdrop-blur-md"
      >
        <a href="/" className={cn('rounded-sm text-base font-semibold tracking-tight', focus)}>
          {brand}
        </a>
        <nav aria-label={label} className="hidden flex-1 justify-center @xl:flex">
          <ul className="flex items-center gap-0.5">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm transition-colors',
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
            className={cn(
              'ml-auto rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 @xl:ml-0',
              focus,
            )}
          >
            {action.label}
          </a>
        )}
      </motion.div>
    </Tag>
  )
}
