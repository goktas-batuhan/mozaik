// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/svg-draw-on-scroll/index.tsx
import { type MotionValue, motion, useReducedMotion, useReducedMotionConfig, useScroll, useSpring, useTransform } from 'motion/react'
import { type ComponentPropsWithoutRef, type RefObject, useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SvgDrawOnScrollProps extends ComponentPropsWithoutRef<'div'> {
  /** One or more path `d` strings in viewBox units. Several paths are drawn one after another. */
  paths: string[]
  viewBox?: string
  strokeWidth?: number
  /** Scrollable element that drives the drawing. Defaults to the page. */
  container?: RefObject<HTMLElement | null>
}

/** Strokes are drawn as the element scrolls through view and undrawn when you scroll back. Decorative. */
export function SvgDrawOnScroll({ paths, viewBox = '0 0 100 100', strokeWidth = 2, container, className, ...props }: SvgDrawOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ container, target: ref, offset: ['start 0.9', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { damping: 28, mass: 0.4, stiffness: 240 })

  return (
    <div ref={ref} {...props} className={cn('relative text-foreground', className)}>
      <svg aria-hidden className="size-full" fill="none" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        {paths.map((d, i) => (
          <Stroke key={`${i}-${d}`} d={d} progress={progress} range={[i / paths.length, (i + 1) / paths.length]} strokeWidth={strokeWidth} still={reduced} />
        ))}
      </svg>
    </div>
  )
}

function Stroke({ d, progress, range, strokeWidth, still }: { d: string; progress: MotionValue<number>; range: [number, number]; strokeWidth: number; still: boolean }) {
  const pathLength = useTransform(progress, range, [0, 1])
  return (
    <motion.path
      d={d}
      pathLength={1}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      style={{ pathLength: still ? 1 : pathLength }}
    />
  )
}
