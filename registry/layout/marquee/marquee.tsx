// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/marquee.tsx
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useReducedMotionConfig, useTransform } from 'motion/react'
import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface MarqueeProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Content to loop. */
  children: ReactNode
  /** Run the loop in the opposite direction. */
  reverse?: boolean
  /** Pause while the pointer or keyboard focus is inside. */
  pauseOnHover?: boolean
  /** Scroll vertically instead of horizontally. */
  vertical?: boolean
  /** How many copies of the content to render. Raise it if the content is short. */
  repeat?: number
  /** Seconds for one full loop. */
  duration?: number
  /** Space between items and between copies, any CSS length. */
  gap?: string
  /** Stops the loop and shows the content still. */
  disabled?: boolean
  className?: string
}

/** Endless loop of content. Copies after the first are hidden from assistive tech. */
export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = '1rem',
  disabled = false,
  className,
  ...props
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)
  const [paused, setPaused] = useState(false)
  const progress = useMotionValue(0)
  const still = disabled || !!reduced

  useAnimationFrame((_, delta) => {
    if (still || paused || !inView) return
    const step = (delta / (duration * 1000)) * 100
    const next = progress.get() + (reverse ? -step : step)
    progress.set(((next % 100) + 100) % 100)
  })

  const transform = useTransform(progress, (p) => {
    const shift = `calc(${-p}% - ${p / 100} * ${gap})`
    return vertical ? `translateY(${shift})` : `translateX(${shift})`
  })

  return (
    <div
      {...props}
      ref={ref}
      style={{ gap, ...props.style }}
      className={cn('flex overflow-hidden', vertical ? 'flex-col' : 'flex-row', className)}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocus={pauseOnHover ? () => setPaused(true) : undefined}
      onBlur={pauseOnHover ? () => setPaused(false) : undefined}
    >
      {Array.from({ length: Math.max(1, repeat) }, (_, i) => (
        <motion.div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          inert={i > 0 ? true : undefined}
          style={{ transform, gap }}
          className={cn('flex shrink-0 justify-around', vertical ? 'flex-col' : 'flex-row')}
        >
          {children}
        </motion.div>
      ))}
    </div>
  )
}
