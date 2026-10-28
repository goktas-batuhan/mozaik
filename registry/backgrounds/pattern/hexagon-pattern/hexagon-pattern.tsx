// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/hexagon-pattern.tsx
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface HexagonPatternProps {
  /** Content rendered above the honeycomb. */
  children?: ReactNode
  /** Radius of each hexagon in pixels, centre to corner. */
  radius?: number
  /** Space between neighbouring hexagons in pixels. */
  gap?: number
  /** Flat-top hexagons in columns, or pointy-top hexagons in rows. */
  direction?: 'horizontal' | 'vertical'
  /** `[column, row]` pairs of hexagons to fill in the primary color. */
  highlight?: [number, number][]
  /** Fade the honeycomb out towards the edges. */
  fade?: boolean
  className?: string
}

type Direction = NonNullable<HexagonPatternProps['direction']>

const FADE = 'radial-gradient(ellipse at center, black 30%, transparent 75%)'

function spacing(r: number, direction: Direction, gap: number) {
  const s = Math.sqrt(3)
  return direction === 'horizontal'
    ? { col: (3 * r) / 2 + (s * gap) / 2, row: s * r + gap }
    : { col: s * r + gap, row: (3 * r) / 2 + (s * gap) / 2 }
}

function corners(cx: number, cy: number, r: number, direction: Direction) {
  const start = direction === 'horizontal' ? 0 : 30
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((start + i * 60) * Math.PI) / 180
    return `${(cx + r * Math.cos(angle)).toFixed(3)},${(cy + r * Math.sin(angle)).toFixed(3)}`
  }).join(' ')
}

/** Centres of the hexagons that touch one repeating tile, wrapped so the seams close. */
function tile(r: number, direction: Direction, gap: number) {
  const { col, row } = spacing(r, direction, gap)
  const horizontal = direction === 'horizontal'
  const w = horizontal ? col * 2 : col
  const h = horizontal ? row : row * 2
  const base: [number, number][] = horizontal
    ? [[col / 2, row / 2], [(col * 3) / 2, row]]
    : [[col / 2, row / 2], [col, (row * 3) / 2]]
  const centers: [number, number][] = []
  for (const [cx, cy] of base) {
    for (const dx of [-w, 0, w]) {
      for (const dy of [-h, 0, h]) {
        const x = cx + dx
        const y = cy + dy
        if (x + r > 0 && x - r < w && y + r > 0 && y - r < h) centers.push([x, y])
      }
    }
  }
  return { w, h, centers }
}

function centerOf(column: number, row: number, r: number, direction: Direction, gap: number): [number, number] {
  const { col, row: rowStep } = spacing(r, direction, gap)
  if (direction === 'horizontal') {
    return [column * col + col / 2, row * rowStep + rowStep / 2 + (column % 2 ? rowStep / 2 : 0)]
  }
  return [column * col + col / 2 + (row % 2 ? col / 2 : 0), row * rowStep + rowStep / 2]
}

/**
 * A honeycomb of hairline hexagons drawn as one repeating SVG pattern, with
 * optional filled cells. Static, so it costs nothing at run time.
 */
export function HexagonPattern({
  children,
  radius = 40,
  gap = 0,
  direction = 'horizontal',
  highlight,
  fade = true,
  className,
}: HexagonPatternProps) {
  const id = useId()
  const r = Math.max(radius, 4)
  const { w, h, centers } = tile(r, direction, gap)

  return (
    <div className={cn('relative isolate overflow-hidden bg-background', className)}>
      <svg
        aria-hidden
        data-hexagon-pattern
        className="pointer-events-none absolute inset-0 -z-10 size-full fill-primary/25 stroke-foreground/15"
        style={fade ? { maskImage: FADE, WebkitMaskImage: FADE } : undefined}
      >
        <defs>
          <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" x={-1} y={-1}>
            {centers.map(([cx, cy]) => (
              <polygon key={`${cx}-${cy}`} className="fill-none" points={corners(cx, cy, r, direction)} />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} stroke="none" />
        {highlight && highlight.length > 0 ? (
          <svg className="overflow-visible" x={-1} y={-1}>
            {highlight.map(([c, rw]) => {
              const [cx, cy] = centerOf(c, rw, r, direction, gap)
              return <polygon key={`${c}-${rw}`} data-lit points={corners(cx, cy, r - 1, direction)} strokeWidth={0} />
            })}
          </svg>
        ) : null}
      </svg>
      {children}
    </div>
  )
}
