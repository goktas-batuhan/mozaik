// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/scroll-progress.tsx
import { motion, useScroll, useSpring } from 'motion/react'
import type { RefObject } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollProgressProps {
  /** Scrollable element to track. Defaults to the page. */
  container?: RefObject<HTMLElement | null>
  /** Smooth the bar with a spring instead of following the scroll exactly. */
  smooth?: boolean
  /** Hides the bar. */
  disabled?: boolean
  /** Position and size. Defaults to a thin bar fixed to the top of the viewport. */
  className?: string
}

/**
 * A thin bar that fills as you scroll. It is decorative; the scroll position
 * itself is what assistive tech already reports.
 */
export function ScrollProgress({ container, smooth = true, disabled = false, className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(container ? { container } : undefined)
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 30, restDelta: 0.001 })

  if (disabled) return null

  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary', className)}
      style={{ scaleX: smooth ? spring : scrollYProgress }}
    />
  )
}
