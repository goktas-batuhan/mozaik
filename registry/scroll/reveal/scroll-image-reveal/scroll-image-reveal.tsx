// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/scroll-image-reveal/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig, useScroll, useSpring, useTransform } from 'motion/react'
import { type ComponentPropsWithoutRef, type RefObject, useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type ScrollRevealMask = 'wipe' | 'curtain' | 'circle'
export type ScrollRevealDirection = 'left' | 'right' | 'up' | 'down'

export interface ScrollImageRevealProps extends ComponentPropsWithoutRef<'div'> {
  /** How the frame opens: a wipe from one side, a curtain from top or bottom, or a growing circle. */
  mask?: ScrollRevealMask
  /** Where the reveal starts. Left/right apply to wipe, up/down to curtain. */
  direction?: ScrollRevealDirection
  /** Counter-parallax travel of the content in pixels. 0 turns it off. */
  parallax?: number
  /** Scrollable element that drives the reveal. Defaults to the page. */
  container?: RefObject<HTMLElement | null>
  /** Keep the frame open once revealed instead of closing on scroll-up. */
  once?: boolean
}

const clamp = (v: number) => Math.min(1, Math.max(0, v))

function clip(mask: ScrollRevealMask, direction: ScrollRevealDirection, p: number) {
  const hidden = (1 - clamp(p)) * 100
  if (mask === 'circle') return `circle(${clamp(p) * 90}% at 50% 50%)`
  if (mask === 'curtain') return direction === 'down' ? `inset(${hidden}% 0% 0% 0%)` : `inset(0% 0% ${hidden}% 0%)`
  return direction === 'right' ? `inset(0% 0% 0% ${hidden}%)` : `inset(0% ${hidden}% 0% 0%)`
}

/** A frame that opens with a wipe, curtain or circle as it scrolls into view. Put any media inside. */
export function ScrollImageReveal({
  mask = 'wipe',
  direction = 'left',
  parallax = 40,
  container,
  once = false,
  className,
  children,
  ...props
}: ScrollImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const peak = useRef(0)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ container, target: ref, offset: ['start 0.9', 'end 0.6'] })
  const spring = useSpring(scrollYProgress, { damping: 32, mass: 0.4, stiffness: 260 })

  const open = useTransform(spring, (v) => {
    const scaled = clamp(v * 2.5)
    if (!once) return scaled
    peak.current = Math.max(peak.current, scaled)
    return peak.current
  })
  const clipPath = useTransform(open, (v) => (reduced ? 'inset(0% 0% 0% 0%)' : clip(mask, direction, v)))
  const overscan = reduced ? 0 : Math.abs(parallax)
  const y = useTransform(spring, (v) => (reduced ? 0 : overscan - v * overscan * 2))

  return (
    <motion.div ref={ref} {...(props as object)} className={cn('relative overflow-hidden rounded-2xl', className)} style={{ clipPath }}>
      <motion.div
        className="absolute inset-x-0"
        style={{ top: -overscan, height: `calc(100% + ${overscan * 2}px)`, y }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
