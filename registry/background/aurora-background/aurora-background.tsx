import { useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface AuroraBackgroundProps {
  /** Content rendered above the aurora. */
  children?: ReactNode
  /** Strength of the aurora, from 0 (off) to 1. */
  intensity?: number
  /** Speed multiplier. 0 holds the aurora still. */
  speed?: number
  className?: string
}

interface Blob {
  /** Any CSS color; derived from the primary token so themes carry over. */
  color: string
  /** Position and size inside the aurora layer. */
  className: string
  opacity: number
  /** Seconds for one sweep at speed 1. */
  duration: number
  /** Seconds of phase offset, so the blobs never move in sync. */
  offset: number
  frames: string[]
}

// Relative color syntax shifts the hue of the primary token, giving the aurora its
// bands without hard-coding a single color.
const BLOBS: Blob[] = [
  {
    color: 'var(--primary)',
    className: 'left-[-15%] top-[-35%] h-[80%] w-[65%]',
    opacity: 0.85,
    duration: 18,
    offset: 0,
    frames: [
      'translate3d(0%, 0%, 0) rotate(0deg) scale(1)',
      'translate3d(30%, 12%, 0) rotate(25deg) scale(1.2)',
      'translate3d(10%, 22%, 0) rotate(-10deg) scale(0.9)',
    ],
  },
  {
    color: 'oklch(from var(--primary) calc(l + 0.06) c calc(h + 40))',
    className: 'right-[-20%] top-[-30%] h-[70%] w-[60%]',
    opacity: 0.65,
    duration: 22,
    offset: 6,
    frames: [
      'translate3d(0%, 0%, 0) rotate(0deg) scale(1.1)',
      'translate3d(-35%, 18%, 0) rotate(-20deg) scale(0.95)',
      'translate3d(-12%, 4%, 0) rotate(15deg) scale(1.25)',
    ],
  },
  {
    color: 'oklch(from var(--primary) l c calc(h - 60))',
    className: 'left-[20%] top-[-20%] h-[60%] w-[55%]',
    opacity: 0.7,
    duration: 26,
    offset: 11,
    frames: [
      'translate3d(0%, 0%, 0) rotate(0deg) scale(0.9)',
      'translate3d(-25%, 25%, 0) rotate(30deg) scale(1.15)',
      'translate3d(22%, 10%, 0) rotate(-15deg) scale(1)',
    ],
  },
  {
    color: 'oklch(from var(--primary) calc(l - 0.08) calc(c * 0.8) calc(h - 110))',
    className: 'left-[-5%] top-[5%] h-[55%] w-[70%]',
    opacity: 0.55,
    duration: 30,
    offset: 3,
    frames: [
      'translate3d(0%, 0%, 0) rotate(-8deg) scale(1)',
      'translate3d(28%, -12%, 0) rotate(12deg) scale(1.2)',
      'translate3d(8%, 14%, 0) rotate(0deg) scale(0.85)',
    ],
  },
]

const FADE = 'radial-gradient(130% 95% at 50% 0%, black 45%, transparent 100%)'

/**
 * A slow, blurred aurora drifting behind its children. The blobs move with the Web
 * Animations API on transform only, so the compositor does the work; they pause off
 * screen and hold still under reduced motion.
 */
export function AuroraBackground({ children, intensity = 0.7, speed = 1, className }: AuroraBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const animations = useRef<Animation[]>([])
  const visible = useRef(false)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(rootRef)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer || reduced || speed <= 0) return
    const nodes = Array.from(layer.children) as HTMLElement[]
    if (typeof nodes[0]?.animate !== 'function') return

    const list = nodes.map((node, i) => {
      const blob = BLOBS[i]
      const animation = node.animate(
        blob.frames.map((transform) => ({ transform })),
        {
          duration: (blob.duration * 1000) / speed,
          delay: (-blob.offset * 1000) / speed,
          iterations: Infinity,
          direction: 'alternate',
          easing: 'ease-in-out',
        },
      )
      if (!visible.current) animation.pause()
      return animation
    })
    animations.current = list
    return () => {
      list.forEach((a) => a.cancel())
      animations.current = []
    }
  }, [reduced, speed])

  useEffect(() => {
    visible.current = inView
    animations.current.forEach((a) => (inView ? a.play() : a.pause()))
  }, [inView])

  const strength = Math.min(Math.max(intensity, 0), 1)

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div
        ref={layerRef}
        aria-hidden
        data-aurora
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ opacity: strength, maskImage: FADE, WebkitMaskImage: FADE } as CSSProperties}
      >
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={cn('absolute rounded-full blur-3xl will-change-transform', blob.className)}
            style={{
              opacity: blob.opacity,
              transform: blob.frames[0],
              backgroundImage: `radial-gradient(closest-side, ${blob.color}, transparent)`,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  )
}
