// Source: magicuidesign/magicui (MIT)
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useId, useState, type RefObject } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AnimatedBeamProps {
  /** The element the SVG is laid over. It must be `position: relative` (or otherwise positioned). */
  containerRef: RefObject<HTMLElement | null>
  /** Where the beam starts. */
  fromRef: RefObject<HTMLElement | null>
  /** Where the beam ends. */
  toRef: RefObject<HTMLElement | null>
  /** How far the path bows away from a straight line, in pixels. Negative bows the other way. */
  curvature?: number
  /** Runs the beam from `toRef` back to `fromRef`. */
  reverse?: boolean
  /** Seconds for one pass of the light. */
  duration?: number
  /** Seconds before the first pass. */
  delay?: number
  /** Seconds to wait between passes. */
  repeatDelay?: number
  /** Stroke width of the path and the beam. */
  pathWidth?: number
  /** Opacity of the resting path under the beam. */
  pathOpacity?: number
  /** Any CSS color, ideally a token. */
  pathColor?: string
  /** Color at the head of the beam. */
  gradientFrom?: string
  /** Color at the tail of the beam. */
  gradientTo?: string
  /** Stops the light: only the resting path stays. */
  disabled?: boolean
  className?: string
}

/** A light that flows along a curved path between two elements. Decorative: the SVG is `aria-hidden`. */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  repeatDelay = 0,
  pathWidth = 2,
  pathOpacity = 0.25,
  pathColor = 'var(--muted-foreground)',
  gradientFrom = 'var(--primary)',
  gradientTo = 'var(--ring)',
  disabled = false,
  className,
}: AnimatedBeamProps) {
  const reduced = usePrefersReducedMotion()
  const id = useId()
  const [geo, setGeo] = useState({ w: 0, h: 0, sx: 0, sy: 0, ex: 0, ey: 0 })
  const [visible, setVisible] = useState(true)

  // Measure the two ends again whenever the container resizes.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const update = () => {
      const from = fromRef.current
      const to = toRef.current
      if (!from || !to) return
      const c = container.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      setGeo({
        w: c.width,
        h: c.height,
        sx: a.left - c.left + a.width / 2,
        sy: a.top - c.top + a.height / 2,
        ex: b.left - c.left + b.width / 2,
        ey: b.top - c.top + b.height / 2,
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(container)
    return () => ro.disconnect()
  }, [containerRef, fromRef, toRef])

  // The light only moves while the diagram is on screen.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(container)
    return () => io.disconnect()
  }, [containerRef])

  const { sx, sy, ex, ey } = geo
  const d = `M ${sx},${sy} Q ${(sx + ex) / 2},${(sy + ey) / 2 - curvature} ${ex},${ey}`

  // The gradient window is one path-length long and slides from before the start to past the end.
  const [ax, ay, bx, by] = reverse ? [ex, ey, sx, sy] : [sx, sy, ex, ey]
  const dx = bx - ax
  const dy = by - ay
  const moving = !reduced && !disabled && visible

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      fill="none"
      className={cn('pointer-events-none absolute top-0 left-0', className)}
    >
      <path d={d} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      {moving ? (
        <>
          <path d={d} stroke={`url(#${id})`} strokeWidth={pathWidth} strokeLinecap="round" />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: ax - dx, y1: ay - dy, x2: ax, y2: ay }}
              animate={{ x1: [ax - dx, bx], y1: [ay - dy, by], x2: [ax, bx + dx], y2: [ay, by + dy] }}
              transition={{ delay, duration, repeat: Infinity, repeatDelay, ease: [0.16, 1, 0.3, 1] }}
            >
              <stop style={{ stopColor: gradientFrom }} stopOpacity="0" />
              <stop style={{ stopColor: gradientFrom }} />
              <stop offset="32.5%" style={{ stopColor: gradientTo }} />
              <stop offset="100%" style={{ stopColor: gradientTo }} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      ) : (
        // Still frame: the path in the beam's color, without the travelling light.
        <path d={d} stroke={gradientFrom} strokeOpacity={0.5} strokeWidth={pathWidth} strokeLinecap="round" />
      )}
    </svg>
  )
}
