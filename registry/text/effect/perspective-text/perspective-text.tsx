// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/perspective-text-3d/index.tsx
import { motion, useMotionValue, useReducedMotion, useReducedMotionConfig, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PerspectiveTextProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Split into words, or into lines at each line break. */
  split?: 'words' | 'lines'
  /** Distance between neighbouring pieces along the depth axis, in pixels. */
  depth?: number
  /** Perspective distance in pixels. Lower is more dramatic. */
  perspective?: number
  /** Largest tilt around the vertical axis, in degrees. */
  rotateY?: number
  /** Largest tilt around the horizontal axis, in degrees. */
  rotateX?: number
  /** Tilt towards the cursor while it is over the text. Off on touch screens and under reduced motion. */
  interactive?: boolean
  className?: string
}

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 }

/** Text pieces stacked in depth on a plane that tilts towards the cursor. */
export function PerspectiveText({
  text,
  split = 'words',
  depth = 36,
  perspective = 800,
  rotateY = 14,
  rotateX = 9,
  interactive = true,
  className,
}: PerspectiveTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  // At rest the plane is turned a little, so the depth shows without any input.
  const restX = -rotateX / 2
  const restY = rotateY / 2
  const tiltX = useMotionValue(restX)
  const tiltY = useMotionValue(restY)
  const springX = useSpring(tiltX, SPRING)
  const springY = useSpring(tiltY, SPRING)

  useEffect(() => {
    const el = ref.current
    if (!el || !interactive || reduced) return
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = el.getBoundingClientRect()
      const dx = (event.clientX - rect.left) / rect.width - 0.5
      const dy = (event.clientY - rect.top) / rect.height - 0.5
      tiltY.set(dx * 2 * rotateY)
      tiltX.set(-dy * 2 * rotateX)
    }
    const leave = () => {
      tiltX.set(restX)
      tiltY.set(restY)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [interactive, reduced, rotateX, rotateY, restX, restY, tiltX, tiltY])

  const pieces = split === 'lines' ? text.split('\n').filter(Boolean) : text.split(/\s+/).filter(Boolean)
  const middle = (pieces.length - 1) / 2

  return (
    <div ref={ref} className={cn('inline-block', className)} style={{ perspective }}>
      <span className="sr-only">{text}</span>
      <motion.div
        className="[transform-style:preserve-3d]"
        style={{ rotateX: reduced ? restX : springX, rotateY: reduced ? restY : springY }}
        initial={false}
      >
        {pieces.map((piece, i) => (
          <span
            key={i}
            aria-hidden
            data-piece
            className={cn(split === 'lines' ? 'block' : 'inline-block')}
            style={{ transform: `translateZ(${(i - middle) * depth}px)` }}
          >
            {piece}
            {split === 'words' && i < pieces.length - 1 ? ' ' : null}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
