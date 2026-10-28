// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/notifications/toast-notification-banner.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState, type ComponentPropsWithoutRef, type Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface NotificationBannerProps extends Omit<ComponentPropsWithoutRef<'output'>, 'children'> {
  /** The message. */
  message?: string
  /** Label of the action button. Pass an empty string to hide it. */
  actionLabel?: string
  /** Label of the button that brings the banner back after it was dismissed. */
  showTriggerLabel?: string
  /** Called when the banner starts to close. */
  onDismiss?: () => void
  /** Called when the action button is pressed. */
  onAction?: () => void
  /** Called when the banner is brought back. */
  onShow?: () => void
  /** Seconds the slide and fade take. */
  duration?: number
  ref?: Ref<HTMLOutputElement>
}

/** A small snackbar with a check icon, an optional action and a close button. It slides up, fades out on dismiss and leaves a button to bring it back. */
export function NotificationBanner({
  className,
  message = 'Changes saved',
  actionLabel = 'Undo',
  showTriggerLabel = 'Show notification',
  onDismiss,
  onAction,
  onShow,
  duration = 0.3,
  ref,
  ...props
}: NotificationBannerProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<'open' | 'closing' | 'closed'>('open')
  const exitMs = reduced ? 0 : Math.round(duration * 1000)

  useEffect(() => {
    if (phase !== 'closing') return
    const timer = window.setTimeout(() => setPhase('closed'), exitMs)
    return () => window.clearTimeout(timer)
  }, [phase, exitMs])

  const handleDismiss = () => {
    if (phase !== 'open') return
    setPhase('closing')
    onDismiss?.()
  }

  const handleShow = () => {
    setPhase('open')
    onShow?.()
  }

  if (phase === 'closed') {
    return (
      <button
        type="button"
        onClick={handleShow}
        className={cn(
          'cursor-pointer rounded-xl bg-muted px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
      >
        {showTriggerLabel}
      </button>
    )
  }

  return (
    <output
      ref={ref}
      data-slot="notification-banner"
      data-phase={phase}
      style={{ transitionDuration: reduced ? '0s' : `${duration}s` }}
      {...props}
      className={cn(
        'inline-flex max-w-80 items-center gap-2.5 rounded-xl border border-border bg-card/95 px-3 py-2.5 text-card-foreground shadow-lg backdrop-blur-xl',
        'translate-y-0 opacity-100 transition-[opacity,translate] ease-out',
        !reduced && 'starting:translate-y-3 starting:opacity-0',
        !reduced && 'data-[phase=closing]:translate-y-3',
        'data-[phase=closing]:opacity-0',
        className,
      )}
    >
      <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-background">
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>

      <p className="min-w-0 flex-1 text-[13px] leading-tight">{message}</p>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 cursor-pointer rounded text-[13px] font-semibold underline underline-offset-2 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
        >
          {actionLabel}
        </button>
      ) : null}

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </output>
  )
}
