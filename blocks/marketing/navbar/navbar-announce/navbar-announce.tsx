// Source: original
import { useRef, useState, type ElementType, type ReactNode } from 'react'
import { FluidHoverHighlight, useFluidHover } from '@/components/fluid-hover-highlight'
import { cn } from '@/lib/utils'

export interface NavbarAnnounceLink {
  label: string
  href: string
  current?: boolean
}

export interface NavbarAnnounceProps {
  /** Logo or wordmark. */
  brand: ReactNode
  links: NavbarAnnounceLink[]
  /** Text of the announcement strip above the bar. Leave out for no strip. */
  announcement?: ReactNode
  /** Link inside the strip. */
  announcementAction?: { label: string; href: string }
  /** Quiet link next to the call to action. */
  secondaryAction?: { label: string; href: string }
  primaryAction?: { label: string; href: string }
  /** Called when the visitor dismisses the strip. */
  onDismiss?: () => void
  /** Accessible name of the nav landmark. */
  label?: string
  as?: ElementType
  className?: string
}

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** A dismissible announcement strip over a bar whose links share one soft highlight that glides between them. */
export function NavbarAnnounce({
  brand,
  links,
  announcement,
  announcementAction,
  secondaryAction,
  primaryAction,
  onDismiss,
  label = 'Main',
  as: Tag = 'header',
  className,
}: NavbarAnnounceProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const hover = useFluidHover(listRef, { axis: 'x' })
  const [dismissed, setDismissed] = useState(false)
  const showStrip = announcement != null && !dismissed

  return (
    <Tag className={cn('@container w-full border-b border-border bg-background text-foreground', className)}>
      {showStrip && (
        <div className="relative flex items-center justify-center gap-3 bg-primary px-10 py-2 text-center text-xs text-primary-foreground">
          <p className="min-w-0">
            {announcement}
            {announcementAction && (
              <>
                {' '}
                <a href={announcementAction.href} className={cn('rounded-sm font-medium underline underline-offset-4', focus)}>
                  {announcementAction.label}
                </a>
              </>
            )}
          </p>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={() => {
              setDismissed(true)
              onDismiss?.()
            }}
            className={cn('absolute right-2 flex size-7 items-center justify-center rounded-md hover:bg-primary-foreground/15', focus)}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <a href="/" className={cn('rounded-sm text-lg font-semibold tracking-tight', focus)}>
          {brand}
        </a>
        <nav aria-label={label} className="hidden flex-1 justify-center @2xl:flex">
          <ul ref={listRef} className="relative flex items-center" {...hover.containerProps}>
            <FluidHoverHighlight rect={hover.rect} session={hover.session} className="rounded-md" />
            {links.map((link, index) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  {...hover.getItemProps(index)}
                  className={cn(
                    'relative block rounded-md px-3 py-2 text-sm transition-colors',
                    link.current ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
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
            <a href={secondaryAction.href} className={cn('rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground', focus)}>
              {secondaryAction.label}
            </a>
          )}
          {primaryAction && (
            <a
              href={primaryAction.href}
              className={cn('rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90', focus)}
            >
              {primaryAction.label}
            </a>
          )}
        </div>
      </div>
    </Tag>
  )
}
