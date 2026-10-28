// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SkeletonRevealProps {
  /** While true the placeholder shows; when it turns false the content fades in. */
  loading: boolean
  /** The real content. It is always laid out, so the box never changes size. */
  children: ReactNode
  /** Custom placeholder. Defaults to a few grey lines. */
  placeholder?: ReactNode
  /** Seconds for the cross-fade. */
  duration?: number
  /** Announced while loading. */
  label?: string
  className?: string
}

/** A grey bar for building your own placeholder. Pulses unless motion is reduced. */
export function SkeletonBar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  return <span aria-hidden="true" className={cn('block rounded-md bg-muted', !reduced && 'animate-pulse', className)} />
}

function DefaultPlaceholder() {
  return (
    <div className="flex size-full flex-col justify-center gap-3">
      <SkeletonBar className="h-4 w-2/5" />
      <SkeletonBar className="h-3 w-full" />
      <SkeletonBar className="h-3 w-11/12" />
      <SkeletonBar className="h-3 w-3/5" />
    </div>
  )
}

/** Wraps real content, shows a placeholder while it loads and cross-fades to the content with no layout shift. */
export function SkeletonReveal({ loading, children, placeholder, duration = 0.45, label = 'Loading', className }: SkeletonRevealProps) {
  const reduced = usePrefersReducedMotion()
  const d = reduced ? 0 : duration
  return (
    <div className={cn('relative', className)} aria-busy={loading}>
      <motion.div
        data-content
        aria-hidden={loading}
        inert={loading}
        initial={false}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: d, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
      <motion.div
        data-placeholder
        initial={false}
        animate={{ opacity: loading ? 1 : 0 }}
        transition={{ duration: d, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0"
      >
        {loading ? <span role="status" className="sr-only">{label}</span> : null}
        <div aria-hidden="true" className="size-full">{placeholder ?? <DefaultPlaceholder />}</div>
      </motion.div>
    </div>
  )
}
