import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export type RadarStatus = 'live' | 'scanning' | 'idle' | 'alert'

export interface RadarBadgeProps {
  /** What the watcher is doing. Sets the color and the motion. */
  status?: RadarStatus
  /** Text next to the radar. Defaults to the status name. */
  label?: string
  /** Badge size. */
  size?: 'sm' | 'md'
  className?: string
}

const NAMES: Record<RadarStatus, string> = {
  live: 'Live',
  scanning: 'Scanning',
  idle: 'Idle',
  alert: 'Alert',
}

const TONE: Record<RadarStatus, string> = {
  live: 'text-[var(--success)]',
  scanning: 'text-primary',
  idle: 'text-muted-foreground',
  alert: 'text-destructive',
}

// Seconds per sweep turn and per ring; 0 turns the part off.
const MOTION: Record<RadarStatus, { sweep: number; ring: number }> = {
  live: { sweep: 2.6, ring: 2.6 },
  scanning: { sweep: 1.2, ring: 0 },
  idle: { sweep: 0, ring: 0 },
  alert: { sweep: 1.6, ring: 1.3 },
}

/** A small live-monitoring badge: a radar sweep with spreading rings next to a label. */
export function RadarBadge({ status = 'live', label, size = 'md', className }: RadarBadgeProps) {
  const reduced = usePrefersReducedMotion()
  const name = NAMES[status]
  const text = label ?? name
  const { sweep, ring } = reduced ? { sweep: 0, ring: 0 } : MOTION[status]

  return (
    <span
      role="status"
      data-status={status}
      className={cn(
        'inline-flex items-center rounded-full border bg-card font-medium text-card-foreground',
        size === 'sm' ? 'h-6 gap-1.5 pr-2.5 pl-1.5 text-xs' : 'h-8 gap-2 pr-3.5 pl-2 text-sm',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full border border-current/35 bg-current/10',
          size === 'sm' ? 'size-4' : 'size-5',
          TONE[status],
        )}
      >
        <span className="absolute inset-[28%] rounded-full border border-current/25" />
        {sweep > 0 && (
          <motion.span
            className="absolute inset-0 rounded-full opacity-70"
            style={{ background: 'conic-gradient(from 0deg, transparent 0deg 250deg, currentColor 360deg)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: sweep, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {ring > 0 &&
          [0, 0.5].map((offset) => (
            <motion.span
              key={offset}
              className="absolute inset-0 rounded-full border border-current"
              initial={{ scale: 0.15, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: ring, delay: offset * ring, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        <span
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current',
            size === 'sm' ? 'size-1' : 'size-1.5',
          )}
        />
      </span>
      {label && label !== name && <span className="sr-only">{name}: </span>}
      <span className="tabular-nums">{text}</span>
    </span>
  )
}
