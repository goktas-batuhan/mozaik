// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/count-badge/index.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type CountBadgeStatus = 'online' | 'offline' | 'busy' | 'away'
export type CountBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface CountBadgeProps {
  /** What the badge sits on: an avatar, an icon, a button. Without it the badge stands alone. */
  children?: ReactNode
  className?: string
  /** The number shown by the `count` variant. */
  count?: number
  /** Largest number shown; above it the badge reads `max+`. */
  max?: number
  /** Adds a pulsing ring. */
  ping?: boolean
  /** Corner of the child the badge sits on. */
  position?: CountBadgePosition
  /** Show the `count` variant when the count is 0. */
  showZero?: boolean
  /** Presence shown by the `status` variant. */
  status?: CountBadgeStatus
  /** A plain dot, a number, or a presence dot. */
  variant?: 'dot' | 'count' | 'status'
}

const STATUS_COLOR: Record<CountBadgeStatus, string> = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-destructive',
  away: 'bg-primary',
}

const STATUS_NAME: Record<CountBadgeStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
}

const POSITION: Record<CountBadgePosition, string> = {
  'bottom-left': '-bottom-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'top-left': '-top-1 -left-1',
  'top-right': '-top-1 -right-1',
}

function AnimatedCount({ value, max, reduced }: { value: number; max: number; reduced: boolean }) {
  const text = value > max ? `${max}+` : String(value)
  const prev = useRef(value)
  const direction = value > prev.current ? 1 : -1

  useEffect(() => {
    prev.current = value
  }, [value])

  if (reduced) return <span className="leading-none font-medium">{text}</span>

  return (
    <span className="relative overflow-hidden leading-none font-medium">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          className="inline-block"
          initial={{ opacity: 0, y: direction * 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction * -12 }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.3 }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** A notification badge for the corner of an avatar or icon: a dot, an animated count, or a presence dot. */
export function CountBadge({
  variant = 'dot',
  count = 0,
  max = 99,
  status = 'online',
  showZero = false,
  ping = false,
  position = 'top-right',
  children,
  className,
}: CountBadgeProps) {
  const reduced = usePrefersReducedMotion()
  const visible = variant !== 'count' || count > 0 || showZero
  const text = count > max ? `${max}+` : String(count)
  const color = variant === 'status' ? STATUS_COLOR[status] : 'bg-primary'

  const size =
    variant === 'dot'
      ? 'size-2.5'
      : variant === 'status'
        ? 'size-3'
        : text.length === 1
          ? 'size-5 text-xs'
          : text.length === 2
            ? 'h-5 min-w-5 px-1 text-xs'
            : 'h-5 min-w-6 px-1 text-xs'

  const badge = (
    <AnimatePresence mode="wait">
      {visible ? (
        <motion.span
          data-slot="count-badge"
          data-variant={variant}
          className={cn(
            'absolute flex items-center justify-center rounded-full text-primary-foreground',
            color,
            size,
            POSITION[position],
            variant === 'status' && 'ring-2 ring-background',
            className,
          )}
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0, transition: { duration: 0.15 } }}
          transition={reduced ? { duration: 0 } : { type: 'spring', bounce: 0.2, duration: 0.25 }}
        >
          {variant === 'count' && (
            <>
              <span aria-hidden>
                <AnimatedCount value={count} max={max} reduced={reduced} />
              </span>
              <span className="sr-only">{text} unread</span>
            </>
          )}
          {variant === 'status' && <span className="sr-only">{STATUS_NAME[status]}</span>}
          {ping && !reduced && <span aria-hidden className={cn('absolute inset-0 animate-ping rounded-full opacity-75', color)} />}
        </motion.span>
      ) : null}
    </AnimatePresence>
  )

  return (
    <span className="relative inline-flex">
      {children ?? <span className="size-4" />}
      {badge}
    </span>
  )
}
