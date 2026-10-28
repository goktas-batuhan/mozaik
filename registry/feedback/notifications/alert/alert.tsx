// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/alert/index.tsx
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'destructive'

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Body copy under the title. */
  children?: ReactNode
  /** Optional leading icon. Decorative: it is hidden from screen readers. */
  icon?: ReactNode
  /** Bold heading line. */
  title?: ReactNode
  /** Tone of the notice. Warning and destructive interrupt (role alert); info and success are polite (role status). */
  variant?: AlertVariant
}

const TONE: Record<AlertVariant, string> = {
  info: 'border-foreground/15 bg-foreground/5 [&_[data-slot=alert-icon]]:text-foreground',
  success: 'border-success/30 bg-success/10 [&_[data-slot=alert-icon]]:text-success',
  warning: 'border-primary/30 bg-primary/10 [&_[data-slot=alert-icon]]:text-primary',
  destructive: 'border-destructive/30 bg-destructive/10 [&_[data-slot=alert-icon]]:text-destructive',
}

/** An inline page or form notice with an optional icon, title and body. Not a dialog. */
export function Alert({ children, className, icon, title, variant = 'info', ...props }: AlertProps) {
  const urgent = variant === 'warning' || variant === 'destructive'

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      data-slot="alert"
      data-variant={variant}
      {...props}
      className={cn(
        'relative flex w-full gap-3 rounded-lg border px-4 py-3 text-sm text-foreground',
        TONE[variant],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden data-slot="alert-icon" className="mt-0.5 shrink-0 [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div data-slot="alert-title" className="leading-none font-medium">
            {title}
          </div>
        ) : null}
        {children ? (
          <div data-slot="alert-description" className="leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
