// Source: original
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface NavbarFixedLink {
  label: string
  href: string
  /** Marks the page the visitor is on. */
  current?: boolean
}

export interface NavbarFixedAction {
  label: string
  href: string
}

export interface NavbarFixedProps {
  /** Logo or wordmark. */
  brand: ReactNode
  /** Link to the home page. */
  brandHref?: string
  links: NavbarFixedLink[]
  /** Quiet link before the call to action, e.g. "Sign in". */
  secondaryAction?: NavbarFixedAction
  /** Filled call to action at the end. */
  primaryAction?: NavbarFixedAction
  /** `sticky` follows the page flow, `fixed` pins to the viewport, `static` does neither. */
  position?: 'sticky' | 'fixed' | 'static'
  /** Accessible name of the nav landmark. */
  label?: string
  as?: ElementType
  className?: string
}

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** Full-width top bar that stays in view. Links collapse away on narrow containers; pair it with a mobile menu there. */
export function NavbarFixed({
  brand,
  brandHref = '/',
  links,
  secondaryAction,
  primaryAction,
  position = 'sticky',
  label = 'Main',
  as: Tag = 'header',
  className,
}: NavbarFixedProps) {
  return (
    <Tag
      className={cn(
        '@container top-0 z-40 w-full border-b border-border bg-background/80 text-foreground backdrop-blur',
        position === 'sticky' && 'sticky',
        position === 'fixed' && 'fixed inset-x-0',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <a href={brandHref} className={cn('rounded-sm text-lg font-semibold tracking-tight', focus)}>
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
                    link.current ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
                    focus,
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className={cn('rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground', focus)}
            >
              {secondaryAction.label}
            </a>
          )}
          {primaryAction && (
            <a
              href={primaryAction.href}
              className={cn(
                'rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                focus,
              )}
            >
              {primaryAction.label}
            </a>
          )}
        </div>
      </div>
    </Tag>
  )
}
