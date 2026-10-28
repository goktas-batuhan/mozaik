// Source: shadcnblocks/kibo (MIT) — https://github.com/shadcnblocks/kibo/blob/main/packages/status/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type StatusDotState = 'online' | 'offline' | 'maintenance' | 'degraded'

export interface StatusDotProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** Service state. Sets the dot color and the default label. */
  status: StatusDotState
  /** Replaces the default label (Online, Offline, Maintenance, Degraded). */
  children?: ReactNode
  /** Seconds per pulse of the ring around the dot. */
  duration?: number
}

const NAMES: Record<StatusDotState, string> = {
  online: 'Online',
  offline: 'Offline',
  maintenance: 'Maintenance',
  degraded: 'Degraded',
}

const COLOR: Record<StatusDotState, string> = {
  online: 'bg-success',
  offline: 'bg-destructive',
  maintenance: 'bg-muted-foreground',
  degraded: 'bg-primary',
}

/** A pill with a pulsing status dot and a label, for service and uptime states. */
export function StatusDot({ status, children, duration = 1.6, className, ...props }: StatusDotProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <span
      role="status"
      data-slot="status-dot"
      data-status={status}
      {...props}
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground',
        className,
      )}
    >
      <span aria-hidden className="relative flex size-2">
        {!reduced && (
          <motion.span
            className={cn('absolute inline-flex size-full rounded-full', COLOR[status])}
            initial={{ scale: 1, opacity: 0.75 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration, ease: 'easeOut', repeat: Infinity }}
          />
        )}
        <span className={cn('relative inline-flex size-2 rounded-full', COLOR[status])} />
      </span>
      <span className="text-muted-foreground">{children ?? NAMES[status]}</span>
    </span>
  )
}
