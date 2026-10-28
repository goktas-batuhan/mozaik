// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/glow-hover-card/index.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

export interface GlowHoverCardItem {
  /** Unique key. */
  id: string
  /** Card content. */
  content: ReactNode
}

export interface GlowHoverCardsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Cards in the grid. */
  items: GlowHoverCardItem[]
  /** Number of grid columns. */
  columns?: number
  /** Radius in pixels of the glow around the pointer. One glow lights every card it touches. */
  glowSize?: number
  /** Strength of the soft fill, 0 to 1. The glowing border is always full strength. */
  intensity?: number
}

/** A grid of cards lit by one shared glow: the border and fill light up under the pointer and carry across neighbouring cards. */
export function GlowHoverCards({ items, columns = 3, glowSize = 180, intensity = 0.12, className, style, onPointerMove, onPointerLeave, ...props }: GlowHoverCardsProps) {
  const reduced = usePrefersReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const [canHover, setCanHover] = useState(false)
  const [active, setActive] = useState(false)
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
    setActive(true)
    for (const card of gridRef.current?.querySelectorAll<HTMLElement>('[data-slot="card"]') ?? []) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
    }
  }

  return (
    <div
      {...props}
      ref={gridRef}
      data-active={active || undefined}
      onPointerMove={move}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        setActive(false)
      }}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, '--glow-size': `${glowSize}px`, '--glow-fill': intensity, ...style } as CSSProperties}
      className={cn('grid gap-3', className)}
    >
      {items.map((item) => (
        <div key={item.id} data-slot="card" className="relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground">
          <span
            aria-hidden
            className={cn('pointer-events-none absolute inset-0 rounded-[inherit] opacity-0', !reduced && 'transition-opacity duration-300', active && 'opacity-100')}
            style={{
              background: 'radial-gradient(var(--glow-size) circle at var(--glow-x, -999px) var(--glow-y, -999px), color-mix(in oklab, var(--primary) calc(var(--glow-fill) * 100%), transparent), transparent 70%)',
            }}
          />
          <span
            aria-hidden
            data-slot="rim"
            className={cn('pointer-events-none absolute inset-0 rounded-[inherit] border border-primary opacity-0', !reduced && 'transition-opacity duration-300', active && 'opacity-100')}
            style={{
              maskImage: 'radial-gradient(var(--glow-size) circle at var(--glow-x, -999px) var(--glow-y, -999px), black, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(var(--glow-size) circle at var(--glow-x, -999px) var(--glow-y, -999px), black, transparent 70%)',
            }}
          />
          <div className="relative">{item.content}</div>
        </div>
      ))}
    </div>
  )
}
