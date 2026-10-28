// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/glass-card/index.tsx
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
const REST = { x: 30, y: 20 }

export interface GlassCardProps extends ComponentPropsWithoutRef<'div'> {
  /** Backdrop blur strength in pixels. */
  blur?: number
  /** Corner radius in pixels. */
  radius?: number
  /** Frosted body color. Any CSS color; defaults to the card token at 45%. */
  tint?: string
  /** Light that follows the pointer across the pane on hover-capable devices. */
  specular?: boolean
  /** Lift on hover and cast a soft shadow. */
  shadow?: boolean
  ref?: Ref<HTMLDivElement>
}

/** A frosted glass pane: blurred backdrop, polished rim and a specular highlight that follows the pointer. Put it over something colorful. */
export function GlassCard({
  blur = 14,
  radius = 24,
  tint = 'color-mix(in oklab, var(--card) 45%, transparent)',
  specular = true,
  shadow = true,
  className,
  children,
  style,
  onPointerMove,
  onPointerLeave,
  ref,
  ...props
}: GlassCardProps) {
  const reduced = usePrefersReducedMotion()
  const [canHover, setCanHover] = useState(false)
  const [spot, setSpot] = useState(REST)
  const [over, setOver] = useState(false)
  const tracking = specular && canHover && !reduced

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setCanHover(query.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e)
    if (!tracking) return
    const rect = e.currentTarget.getBoundingClientRect()
    setOver(true)
    setSpot({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
  }

  return (
    <div
      {...props}
      ref={ref}
      data-slot="glass-card"
      onPointerMove={move}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        setOver(false)
        setSpot(REST)
      }}
      style={
        {
          borderRadius: radius,
          background: tint,
          backdropFilter: `blur(${blur}px) saturate(1.4)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(1.4)`,
          '--glass-x': `${spot.x}%`,
          '--glass-y': `${spot.y}%`,
          ...style,
        } as CSSProperties
      }
      className={cn(
        'group relative isolate overflow-hidden border border-foreground/15 p-6 text-foreground',
        'shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground)_25%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent)]',
        shadow && 'drop-shadow-xl',
        !reduced && 'transition-transform duration-300 ease-out',
        shadow && tracking && 'hover:-translate-y-0.5',
        className,
      )}
    >
      {specular ? (
        <span
          aria-hidden
          data-slot="specular"
          className={cn('pointer-events-none absolute inset-0 -z-10', !reduced && 'transition-opacity duration-300')}
          style={{
            opacity: over ? 1 : 0.55,
            background:
              'radial-gradient(240px circle at var(--glass-x) var(--glass-y), color-mix(in oklab, var(--foreground) 22%, transparent), transparent 70%)',
          }}
        />
      ) : null}
      {/* polished top edge */}
      <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 -z-10 h-px bg-linear-to-r from-transparent via-foreground/50 to-transparent" />
      {children}
    </div>
  )
}
