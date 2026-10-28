// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/empty/index.tsx
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Optional action below the copy, such as a button or a link. */
  action?: ReactNode
  /** Supporting sentence. */
  description?: ReactNode
  /** Optional icon above the title. Decorative: it is hidden from screen readers. */
  icon?: ReactNode
  /** The heading. */
  title: ReactNode
}

/** A first-run or no-results state: an optional icon, a heading, a sentence and an action. */
export function EmptyState({ action, className, description, icon, title, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      {...props}
      className={cn('flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}
    >
      {icon ? (
        <div
          aria-hidden
          data-slot="empty-state-icon"
          className="mb-1 flex size-12 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground [&_svg]:size-5"
        >
          {icon}
        </div>
      ) : null}
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 data-slot="empty-state-title" className="text-base leading-snug font-medium text-foreground">
          {title}
        </h3>
        {description ? (
          <p data-slot="empty-state-description" className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div data-slot="empty-state-action" className="mt-1">
          {action}
        </div>
      ) : null}
    </div>
  )
}
