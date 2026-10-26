// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/orbiting-circles.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { Children, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface OrbitingCirclesProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The things that orbit. They are spread evenly around the circle. */
  children?: ReactNode
  /** Run the orbit counter-clockwise. */
  reverse?: boolean
  /** Seconds for one full lap. */
  duration?: number
  /** Seconds to wait before the orbit starts. */
  delay?: number
  /** Radius of the orbit in pixels. */
  radius?: number
  /** Draw the orbit as a thin ring. */
  path?: boolean
  /** Width and height of each orbiting slot in pixels. */
  iconSize?: number
  /** Speed multiplier applied to duration. */
  speed?: number
  /** Stops the orbit and shows the items at rest. */
  disabled?: boolean
  className?: string
}

/**
 * Spreads its children around a circle and slowly walks them around it. Place
 * it inside a sized, relative parent; the orbit centers on that parent.
 */
export function OrbitingCircles({
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  disabled = false,
  className,
  ...props
}: OrbitingCirclesProps) {
  const reduced = usePrefersReducedMotion()
  const still = disabled || !!reduced
  const items = Children.toArray(children)
  const lap = duration / speed
  const sign = reverse ? -1 : 1

  return (
    <div {...props} className="pointer-events-none absolute inset-0">
      {path && (
        <svg aria-hidden className="absolute inset-0 size-full">
          <circle className="stroke-border" strokeWidth={1} cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      )}
      {items.map((child, i) => {
        const angle = (360 / items.length) * i
        return (
          <div key={i} className="absolute top-1/2 left-1/2 size-0">
            <motion.div
              className="absolute size-0"
              initial={{ rotate: angle }}
              animate={still ? undefined : { rotate: angle + 360 * sign }}
              transition={{ duration: lap, delay, ease: 'linear', repeat: Infinity }}
            >
              <div className="absolute" style={{ transform: `translateX(${radius}px)` }}>
                <motion.div
                  className={cn(
                    'pointer-events-auto absolute flex items-center justify-center rounded-full',
                    className,
                  )}
                  style={{ width: iconSize, height: iconSize, left: -iconSize / 2, top: -iconSize / 2 }}
                  initial={{ rotate: -angle }}
                  animate={still ? undefined : { rotate: -angle - 360 * sign }}
                  transition={{ duration: lap, delay, ease: 'linear', repeat: Infinity }}
                >
                  {child}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
