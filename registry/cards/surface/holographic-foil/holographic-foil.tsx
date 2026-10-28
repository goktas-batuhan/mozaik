// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/holographic-foil/index.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, PointerEvent, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'
const REST = { x: 35, y: 30 }

export interface HolographicFoilProps extends ComponentPropsWithoutRef<'div'> {
  /** Strength of the foil from 0 to 1. */
  intensity?: number
  /** Add the fine diffraction lines over the foil. */
  grating?: boolean
  /** Corner radius in pixels. */
  radius?: number
  ref?: Ref<HTMLDivElement>
}

// The foil bands are blended from theme tokens, so it follows any palette.
const BANDS = [
  'var(--primary)',
  'var(--accent)',
  'var(--success)',
  'var(--secondary)',
  'var(--destructive)',
  'var(--primary)',
]

/** A card with a holographic foil layer: rainbow bands shift and a glare slides across as the pointer moves. */
export function HolographicFoil({ intensity = 0.7, grating = true, radius = 20, className, children, style, onPointerMove, onPointerLeave, ref, ...props }: HolographicFoilProps) {
  const reduced = usePrefersReducedMotion()
  const [canHover, setCanHover] = useState(false)
  const [pos, setPos] = useState(REST)
  const [over, setOver] = useState(false)
  const live = canHover && !reduced

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setCanHover(query.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e)
    if (!live) return
    const rect = e.currentTarget.getBoundingClientRect()
    setOver(true)
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
  }

  return (
    <div
      {...props}
      ref={ref}
      data-slot="holographic-foil"
      data-active={over || undefined}
      onPointerMove={move}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        setOver(false)
        setPos(REST)
      }}
      style={{ borderRadius: radius, '--foil-x': `${pos.x}%`, '--foil-y': `${pos.y}%`, ...style } as CSSProperties}
      className={cn('relative isolate overflow-hidden border border-border bg-card p-6 text-card-foreground shadow-lg', className)}
    >
      <span
        aria-hidden
        data-slot="foil"
        className={cn('pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light', !reduced && 'transition-opacity duration-300')}
        style={{
          opacity: over ? intensity : intensity * 0.7,
          backgroundImage: `linear-gradient(115deg, ${BANDS.join(', ')})`,
          backgroundSize: '300% 300%',
          backgroundPosition: 'var(--foil-x) var(--foil-y)',
        }}
      />
      {grating ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: 'repeating-linear-gradient(105deg, color-mix(in oklab, var(--foreground) 35%, transparent) 0 1px, transparent 1px 5px)',
            backgroundPosition: 'var(--foil-x) var(--foil-y)',
          }}
        />
      ) : null}
      <span
        aria-hidden
        data-slot="glare"
        className={cn('pointer-events-none absolute inset-0 -z-10', !reduced && 'transition-opacity duration-300')}
        style={{
          opacity: over ? 0.9 : 0.5,
          background: 'radial-gradient(260px circle at var(--foil-x) var(--foil-y), color-mix(in oklab, var(--foreground) 22%, transparent), transparent 65%)',
        }}
      />
      {children}
    </div>
  )
}
