// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/blur-fade.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig, type HTMLMotionProps, type UseInViewOptions } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface BlurFadeProps
  extends Omit<HTMLMotionProps<'div'>, 'children' | 'initial' | 'animate' | 'exit' | 'variants' | 'transition'> {
  children: ReactNode
  /** Seconds the fade takes. */
  duration?: number
  /** Seconds to wait before the fade starts. */
  delay?: number
  /** Pixels the content travels while it fades in. */
  offset?: number
  /** Direction the content moves while it appears. */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Blur radius in pixels at the start. */
  blur?: number
  /** Wait until the content scrolls into view. */
  inView?: boolean
  /** Margin around the viewport used by inView. */
  inViewMargin?: UseInViewOptions['margin']
  /** Shows the content right away, with no animation. */
  disabled?: boolean
  className?: string
}

/** Fades content in out of a blur, from any direction. */
export function BlurFade({
  children,
  duration = 0.4,
  delay = 0,
  offset = 8,
  direction = 'up',
  blur = 6,
  inView = false,
  inViewMargin = '-50px',
  disabled = false,
  className,
  ...props
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const seen = useInView(ref, { once: true, margin: inViewMargin })

  if (disabled || reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  const horizontal = direction === 'left' || direction === 'right'
  const from = direction === 'up' || direction === 'left' ? offset : -offset
  const axis = horizontal ? 'x' : 'y'
  const visible = !inView || seen

  return (
    <motion.div
      {...props}
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: `blur(${blur}px)`, [axis]: from }}
      animate={
        visible
          ? { opacity: 1, filter: 'blur(0px)', [axis]: 0 }
          : { opacity: 0, filter: `blur(${blur}px)`, [axis]: from }
      }
      transition={{ duration, delay: 0.04 + delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
