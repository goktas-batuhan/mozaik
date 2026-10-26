// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/background-pattern/diagonal-box-pattern.tsx
import { cn } from '@/lib/utils'

export interface DiagonalHatchProps {
  /** Distance between hatch lines, in pixels. */
  spacing?: number
  /** Direction of the lines in degrees. 45 leans right, 135 leans left. */
  angle?: number
  /** Line strength as a percentage of the foreground color. */
  strength?: number
  /** Fades the hatch out towards the edges. */
  fade?: boolean
  className?: string
}

/** Fine diagonal hatching, like a sketch shaded with a ruler. Place it behind content. */
export function DiagonalHatch({ spacing = 10, angle = 45, strength = 9, fade = true, className }: DiagonalHatchProps) {
  const color = `color-mix(in oklab, var(--foreground) ${strength}%, transparent)`
  const mask = fade ? 'radial-gradient(ellipse at center, black 25%, transparent 75%)' : undefined

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `repeating-linear-gradient(${angle}deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${spacing}px)`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  )
}
