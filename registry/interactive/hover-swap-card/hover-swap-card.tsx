// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/apps/ui-layout/registry/components/card/creative-hover-card.tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface HoverSwapCardProps {
  /** Small pill above the title. */
  badge?: string
  /** Title at rest. Screen readers read this one. */
  title: string
  /** Title that crossfades in on hover or focus. */
  hoverTitle?: string
  /** Body text. */
  description?: string
  /** Visual shown at rest. */
  media: ReactNode
  /** Visual that crossfades in on hover or focus. */
  hoverMedia?: ReactNode
  /** Seconds the swap takes. */
  duration?: number
  /** Extra classes for the root element. */
  className?: string
}

/** A card that swaps its title and visual and lifts the media on hover or keyboard focus. */
export function HoverSwapCard({
  badge,
  title,
  hoverTitle,
  description,
  media,
  hoverMedia,
  duration = 0.5,
  className,
}: HoverSwapCardProps) {
  const fade = 'transition-opacity ease-in-out motion-reduce:transition-none'
  return (
    <article
      tabIndex={0}
      style={{ transitionDuration: `${duration}s` }}
      className={cn(
        'group relative w-[320px] max-w-full overflow-hidden rounded-2xl border border-border bg-linear-to-t from-card to-background outline-none transition-colors hover:border-primary/40 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
        className,
      )}
    >
      <div className="px-6 pt-5 pb-4">
        {badge && (
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground motion-reduce:transition-none">
            {badge}
          </span>
        )}
        <h3 className="mt-3 grid text-lg font-semibold text-card-foreground">
          <span
            style={{ transitionDuration: `${duration}s` }}
            className={cn('col-start-1 row-start-1', fade, hoverTitle && 'group-hover:opacity-0 group-focus-visible:opacity-0')}
          >
            {title}
          </span>
          {hoverTitle && (
            <span
              aria-hidden
              style={{ transitionDuration: `${duration}s` }}
              className={cn('col-start-1 row-start-1 opacity-0', fade, 'group-hover:opacity-100 group-focus-visible:opacity-100')}
            >
              {hoverTitle}
            </span>
          )}
        </h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <div
        style={{ transitionDuration: `${duration}s` }}
        className="relative aspect-[4/3] transition-transform ease-in-out group-hover:-translate-y-2 group-focus-visible:-translate-y-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        <div
          style={{ transitionDuration: `${duration}s` }}
          className={cn('absolute inset-0', hoverMedia && 'group-hover:opacity-0 group-focus-visible:opacity-0', fade)}
        >
          {media}
        </div>
        {hoverMedia && (
          <div
            aria-hidden
            style={{ transitionDuration: `${duration}s` }}
            className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100', fade)}
          >
            {hoverMedia}
          </div>
        )}
      </div>
    </article>
  )
}
