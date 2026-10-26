// Source: magicuidesign/magicui (MIT)
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressiveBlurProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Which edge of the nearest positioned ancestor gets the blur. */
  position?: 'top' | 'bottom' | 'both'
  /** Height of each blurred edge, as any CSS length. */
  height?: string
  /** Blur radius in px for each stacked layer, weakest first. More layers = smoother ramp. */
  blurLevels?: number[]
  className?: string
}

const DEFAULT_LEVELS = [0.5, 1, 2, 4, 8, 16, 32, 64]

/** One edge: stacked backdrop-filter layers, each masked to a band, so blur ramps up toward the edge. */
function Edge({
  edge,
  height,
  levels,
  className,
  ...props
}: {
  edge: 'top' | 'bottom'
  height: string
  levels: number[]
  className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>) {
  const n = levels.length
  const step = 100 / n
  // The gradient runs from the inner (clear) side toward the screen edge.
  const dir = edge === 'bottom' ? 'to bottom' : 'to top'
  const pct = (v: number) => `${Math.min(100, Math.round(v * 100) / 100)}%`

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 z-10',
        edge === 'top' ? 'top-0' : 'bottom-0',
        className,
      )}
      style={{ height }}
      {...props}
    >
      {levels.map((blur, i) => {
        const last = i === n - 1
        const mask = last
          ? `linear-gradient(${dir}, transparent ${pct((n - 1) * step)}, black 100%)`
          : `linear-gradient(${dir}, transparent ${pct(i * step)}, black ${pct((i + 1) * step)}, black ${pct((i + 2) * step)}, transparent ${pct((i + 3) * step)})`
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      })}
    </div>
  )
}

/** Gradual blur over the edge of a scrolling area. Place it inside a `relative` wrapper, above the content. Purely decorative and static. */
export function ProgressiveBlur({
  position = 'bottom',
  height = '30%',
  blurLevels = DEFAULT_LEVELS,
  className,
  ...props
}: ProgressiveBlurProps) {
  const levels = blurLevels.length > 0 ? blurLevels : DEFAULT_LEVELS
  return (
    <>
      {position !== 'bottom' && (
        <Edge edge="top" height={height} levels={levels} className={className} data-position="top" {...props} />
      )}
      {position !== 'top' && (
        <Edge edge="bottom" height={height} levels={levels} className={className} data-position="bottom" {...props} />
      )}
    </>
  )
}
