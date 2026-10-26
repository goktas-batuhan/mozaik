import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useRef, useSyncExternalStore, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface DotGridProps {
  /** Content rendered above the grid. */
  children?: ReactNode
  /** Distance between dots, in pixels. */
  gap?: number
  /** Dot diameter, in pixels. */
  dotSize?: number
  /** Light up and grow the dots near the cursor. Off on touch screens and under reduced motion. */
  glow?: boolean
  /** Radius of the cursor glow, in pixels. */
  glowRadius?: number
  /** Fade the grid out towards the edges. */
  fade?: boolean
  /** Lay a fine film grain over the grid. */
  noise?: boolean
  className?: string
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

const dots = (color: string, radius: number) =>
  `radial-gradient(circle at center, ${color} ${radius}px, transparent ${radius + 0.75}px)`

const FADE = 'radial-gradient(ellipse 75% 70% at 50% 50%, black 25%, transparent 100%)'

/**
 * A dot grid with optional film grain. Near the cursor the dots take the primary
 * color and grow; the glow is a mask that follows CSS variables, so nothing runs
 * between pointer moves.
 */
export function DotGrid({
  children,
  gap = 24,
  dotSize = 2,
  glow = true,
  glowRadius = 140,
  fade = true,
  noise = true,
  className,
}: DotGridProps) {
  const glowRef = useRef<HTMLDivElement>(null)
  const filterId = `dot-grid-noise-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const finePointer = useMedia('(hover: hover) and (pointer: fine)')
  const reduced = usePrefersReducedMotion() ?? false
  const interactive = glow && finePointer && !reduced

  const radius = dotSize / 2
  const size = `${gap}px ${gap}px`
  const fadeMask = fade ? FADE : undefined

  const base: CSSProperties = {
    backgroundImage: dots('color-mix(in oklch, var(--foreground) 22%, transparent)', radius),
    backgroundSize: size,
    backgroundPosition: 'center',
    maskImage: fadeMask,
    WebkitMaskImage: fadeMask,
  }

  const cursorMask = `radial-gradient(circle ${glowRadius}px at var(--dot-x, -9999px) var(--dot-y, -9999px), black, transparent)`
  const glowMask = fadeMask ? `${cursorMask}, ${fadeMask}` : cursorMask
  const highlight: CSSProperties = {
    backgroundImage: `${dots('var(--primary)', radius * 1.75)}, radial-gradient(circle ${glowRadius}px at var(--dot-x, -9999px) var(--dot-y, -9999px), color-mix(in oklch, var(--primary) 14%, transparent), transparent)`,
    backgroundSize: `${size}, 100% 100%`,
    backgroundPosition: 'center, 0 0',
    maskImage: glowMask,
    WebkitMaskImage: glowMask,
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = glowRef.current
    if (!el) return
    const rect = event.currentTarget.getBoundingClientRect()
    el.style.setProperty('--dot-x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--dot-y', `${event.clientY - rect.top}px`)
    el.style.opacity = '1'
  }

  const onPointerLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <div
      className={cn('relative isolate overflow-hidden bg-background', className)}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
    >
      <div aria-hidden data-dot-grid className="pointer-events-none absolute inset-0 -z-10">
        <div data-dots className="absolute inset-0" style={base} />
        {interactive && (
          <div
            ref={glowRef}
            data-glow
            className="absolute inset-0 opacity-0 transition-opacity duration-300 will-change-transform"
            style={highlight}
          />
        )}
        {noise && (
          <svg data-noise className="absolute inset-0 size-full text-foreground opacity-[0.08]">
            <filter id={filterId} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -0.55" result="grain" />
              <feFlood floodColor="currentColor" />
              <feComposite operator="in" in2="grain" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} />
          </svg>
        )}
      </div>
      {children}
    </div>
  )
}
