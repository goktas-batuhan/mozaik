// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/retro-grid.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface RetroGridProps {
  /** Tilt of the floor in degrees. 0 is flat on the screen, 90 is edge-on. */
  angle?: number
  /** Size of one grid cell in pixels. */
  cellSize?: number
  /** Color of the grid lines. Any CSS color; defaults to a soft mix of the foreground token. */
  lineColor?: string
  /** Seconds for the grid to travel the length of its pattern. */
  duration?: number
  /** Hides the grid. */
  disabled?: boolean
  className?: string
}

const CELLS = 40

/**
 * A perspective grid that scrolls toward the viewer. Decorative: put it
 * inside a relative element and it fills it.
 */
export function RetroGrid({
  angle = 65,
  cellSize = 60,
  lineColor = 'color-mix(in oklab, var(--foreground) 24%, transparent)',
  duration = 15,
  disabled = false,
  className,
}: RetroGridProps) {
  const reduced = usePrefersReducedMotion()
  if (disabled) return null

  const line = `linear-gradient(to right, ${lineColor} 1px, transparent 0), linear-gradient(to bottom, ${lineColor} 1px, transparent 0)`

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]', className)}
    >
      <div className="absolute inset-0" style={{ transform: `rotateX(${angle}deg)` }}>
        <motion.div
          className="absolute -ml-[250%] w-[600%]"
          style={{
            height: cellSize * CELLS,
            backgroundImage: line,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            y: '-25%',
          }}
          animate={reduced ? undefined : { y: ['-50%', '0%'] }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-background from-10% via-transparent via-50% to-background/50" />
    </div>
  )
}
