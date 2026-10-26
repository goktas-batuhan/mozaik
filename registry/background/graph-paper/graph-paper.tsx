// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/background-pattern/graph-paper-pattern.tsx
import { cn } from '@/lib/utils'

export type GraphPaperFade = 'none' | 'radial' | 'vertical'

export interface GraphPaperProps {
  /** Size of one small square, in pixels. */
  size?: number
  /** Every n-th line is drawn stronger. Use 0 to draw only the small grid. */
  majorEvery?: number
  /** Fades the grid out towards the edges. */
  fade?: GraphPaperFade
  className?: string
}

const MASK: Record<GraphPaperFade, string | undefined> = {
  none: undefined,
  radial: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
  vertical: 'linear-gradient(to bottom, black 35%, transparent 100%)',
}

const line = (percent: number) => `color-mix(in oklab, var(--foreground) ${percent}%, transparent)`

/** Engineering graph paper: fine squares with a stronger line every few cells. Place it behind content. */
export function GraphPaper({ size = 24, majorEvery = 5, fade = 'radial', className }: GraphPaperProps) {
  const major = size * majorEvery
  const layers = [
    `linear-gradient(to right, ${line(6)} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${line(6)} 1px, transparent 1px)`,
  ]
  const sizes = [`${size}px ${size}px`, `${size}px ${size}px`]
  if (majorEvery > 0) {
    layers.unshift(
      `linear-gradient(to right, ${line(12)} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${line(12)} 1px, transparent 1px)`,
    )
    sizes.unshift(`${major}px ${major}px`, `${major}px ${major}px`)
  }

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: layers.join(', '),
        backgroundSize: sizes.join(', '),
        maskImage: MASK[fade],
        WebkitMaskImage: MASK[fade],
      }}
    />
  )
}
