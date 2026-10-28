// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/emboss-surface/index.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import type { CSSProperties, ElementType, PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

export type EmbossSurfaceVariant = 'emboss' | 'deboss' | 'stamp'

export interface EmbossSurfaceProps {
  /** Element or component rendered as the surface. */
  as?: ElementType
  /** Content that receives the relief. */
  children?: ReactNode
  /** `emboss` raises the surface, `deboss` presses it in, `stamp` is a hard-edged raised plate. */
  variant?: EmbossSurfaceVariant
  /** `surface` carves the box; `text` carves the letters only and leaves the box flat. */
  target?: 'surface' | 'text'
  /** Relief depth in pixels. */
  depth?: number
  /** Direction the light comes from in degrees. 0 is right, 90 is up, 135 is the top left. */
  lightAngle?: number
  /** Shadow diffusion from 0 (hard) to 1 (soft). */
  softness?: number
  /** Let the light angle follow the pointer on hover-capable devices. */
  interactive?: boolean
  /** Extra classes for the surface. */
  className?: string
}

// The light and the dark side of the relief come from the theme tokens, so both modes read.
const HIGHLIGHT =
  'rounded-2xl [--es-hi:color-mix(in_oklab,var(--background)_85%,transparent)] [--es-lo:color-mix(in_oklab,var(--foreground)_22%,transparent)] dark:[--es-hi:color-mix(in_oklab,var(--foreground)_10%,transparent)] dark:[--es-lo:color-mix(in_oklab,var(--background)_80%,transparent)]'

function shadows(variant: EmbossSurfaceVariant, target: 'surface' | 'text', dx: number, dy: number, blur: number) {
  const inset = variant === 'deboss' ? 'inset ' : ''
  const sign = variant === 'deboss' ? -1 : 1
  const hardness = variant === 'stamp' ? 0 : blur
  const reach = variant === 'stamp' ? 1.6 : 1
  const hi = [sign * dx * reach, sign * dy * reach]
  const lo = [-sign * dx * reach, -sign * dy * reach]
  if (target === 'text') {
    return `${hi[0] / 2}px ${hi[1] / 2}px ${hardness / 2}px var(--es-hi), ${lo[0] / 2}px ${lo[1] / 2}px ${hardness / 2}px var(--es-lo)`
  }
  return `${inset}${hi[0]}px ${hi[1]}px ${hardness}px var(--es-hi), ${inset}${lo[0]}px ${lo[1]}px ${hardness}px var(--es-lo)`
}

/** A surface carved by light: raised, pressed in or stamped, with the relief following a light angle you set or the pointer. */
export function EmbossSurface({
  as: Tag = 'div',
  children,
  variant = 'emboss',
  target = 'surface',
  depth = 6,
  lightAngle = 135,
  softness = 0.6,
  interactive = false,
  className,
}: EmbossSurfaceProps) {
  const reduced = usePrefersReducedMotion()
  const [canHover, setCanHover] = useState(false)
  const [angle, setAngle] = useState<number | null>(null)
  const follows = interactive && canHover && !reduced

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setCanHover(query.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const current = follows && angle !== null ? angle : lightAngle
  const rad = (current * Math.PI) / 180
  const dx = Math.round(Math.cos(rad) * depth * 100) / 100
  const dy = Math.round(-Math.sin(rad) * depth * 100) / 100
  const blur = Math.max(0, depth * (0.4 + softness * 2))
  const relief = shadows(variant, target, dx, dy, blur)

  const onPointerMove = (e: PointerEvent) => {
    if (!follows) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    setAngle((Math.atan2(-y, x) * 180) / Math.PI)
  }

  return (
    <Tag
      data-variant={variant}
      data-target={target}
      data-angle={Math.round(current)}
      onPointerMove={follows ? onPointerMove : undefined}
      onPointerLeave={follows ? () => setAngle(null) : undefined}
      style={(target === 'text' ? { textShadow: relief } : { boxShadow: relief }) as CSSProperties}
      className={cn(
        HIGHLIGHT,
        target === 'surface' && 'bg-card p-8',
        'text-card-foreground',
        !reduced && 'transition-[box-shadow,text-shadow] duration-200 ease-out',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
