// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/background-gradient/dark-midnight-mesh-background.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface MeshGlowProps {
  /** Lets the glows drift slowly. Off, or under reduced motion, they hold still. */
  animated?: boolean
  /** Seconds one drift cycle takes. */
  duration?: number
  /** Overall strength of the glows, from 0 to 1. */
  intensity?: number
  className?: string
}

const BLOBS = [
  { cls: '-top-[18%] -left-[10%] h-[60%] w-[55%] bg-primary/40', move: { x: [0, 60, 0], y: [0, 30, 0] } },
  { cls: 'top-[10%] -right-[12%] h-[50%] w-[48%] bg-success/30', move: { x: [0, -50, 0], y: [0, 40, 0] } },
  { cls: '-bottom-[20%] left-[24%] h-[52%] w-[50%] bg-foreground/15', move: { x: [0, 40, 0], y: [0, -40, 0] } },
]

/** Soft blurred glows over a fine grid, with a vignette that keeps the edges calm. Place it behind content. */
export function MeshGlow({ animated = true, duration = 24, intensity = 1, className }: MeshGlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)
  const drift = animated && !reduced && inView

  return (
    <div ref={ref} aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -inset-8 blur-3xl" style={{ opacity: intensity }}>
        {BLOBS.map((blob, i) => (
          <motion.div
            key={i}
            className={cn('absolute rounded-full', blob.cls)}
            animate={drift ? blob.move : { x: 0, y: 0 }}
            transition={
              drift
                ? { duration: duration + i * 4, ease: 'easeInOut', repeat: Infinity }
                : { duration: 0 }
            }
          />
        ))}
      </div>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in oklab, var(--foreground) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 7%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, transparent 55%, color-mix(in oklab, var(--background) 70%, transparent) 100%)',
        }}
      />
    </div>
  )
}
