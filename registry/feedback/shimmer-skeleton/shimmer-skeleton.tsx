// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/content-skeleton/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ShimmerSkeletonProps {
  /** Content to stand in for. While loading it keeps its layout but is hidden. */
  children?: ReactNode
  /** Shows the skeleton. When false the children render as they are. */
  loading?: boolean
  /** Accessible name announced while loading. */
  label?: string
  /** Seconds one shimmer sweep takes. */
  duration?: number
  /** Turns the shimmer off and keeps a still placeholder. */
  disabled?: boolean
  /** Without children, size the block with classes such as `h-4 w-40`. */
  className?: string
}

/** A placeholder block with a soft light sweeping across it. Wrap real content to keep its exact size. */
export function ShimmerSkeleton({
  children,
  loading = true,
  label = 'Loading',
  duration = 1.6,
  disabled = false,
  className,
}: ShimmerSkeletonProps) {
  const reduced = usePrefersReducedMotion()

  if (!loading) return <>{children}</>

  const still = disabled || reduced

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn('relative overflow-hidden rounded-md bg-muted', !children && 'min-h-4', className)}
    >
      {children ? (
        <div aria-hidden className="invisible">
          {children}
        </div>
      ) : null}
      {still ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          initial={{ x: '0%' }}
          animate={{ x: '400%' }}
          transition={{ duration, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.2 }}
        />
      )}
    </div>
  )
}
