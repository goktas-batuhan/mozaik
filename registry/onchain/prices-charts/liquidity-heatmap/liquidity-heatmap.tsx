// Source: original
import { useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface LiquidityHeatmapProps {
  /** Liquidity per cell, `cells[row][column]`. Row 0 is the highest price, column 0 the oldest time. */
  cells: readonly (readonly number[])[]
  /** One label per row, top to bottom, such as '3,420'. */
  rowLabels: readonly string[]
  /** One label per column, left to right, such as '09:00'. */
  columnLabels: readonly string[]
  /** Row index of the current price; its row gets a marker. */
  markerRow?: number
  formatValue?: (value: number) => string
  /** Accessible name of the grid. */
  label?: string
  className?: string
}

const defaultValue = (v: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v)

/** Resting liquidity by price level over time, as a grid of cells whose strength follows the size. Arrow keys move through the cells. */
export function LiquidityHeatmap({ cells, rowLabels, columnLabels, markerRow, formatValue = defaultValue, label = 'Liquidity heatmap', className }: LiquidityHeatmapProps) {
  const rows = cells.length
  const cols = cells.reduce((m, r) => Math.max(m, r.length), 0)
  const [focus, setFocus] = useState<[number, number]>([0, 0])
  const [shown, setShown] = useState<[number, number] | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const max = Math.max(1e-9, ...cells.flat().filter(Number.isFinite))

  if (rows === 0 || cols === 0) return <p role="img" aria-label={`${label}: no data`} className={cn('text-sm text-muted-foreground', className)}>No data</p>

  const move = (r: number, c: number) => {
    const next: [number, number] = [Math.min(rows - 1, Math.max(0, r)), Math.min(cols - 1, Math.max(0, c))]
    setFocus(next)
    setShown(next)
    grid.current?.querySelector<HTMLElement>(`[data-cell="${next[0]}-${next[1]}"]`)?.focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const [r, c] = focus
    const keys: Record<string, [number, number]> = {
      ArrowUp: [r - 1, c],
      ArrowDown: [r + 1, c],
      ArrowLeft: [r, c - 1],
      ArrowRight: [r, c + 1],
      Home: [r, 0],
      End: [r, cols - 1],
      PageUp: [0, c],
      PageDown: [rows - 1, c],
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    move(...keys[event.key])
  }

  const value = (r: number, c: number) => (Number.isFinite(cells[r]?.[c]) ? cells[r][c] : 0)
  const readout = shown ? `${rowLabels[shown[0]] ?? `Row ${shown[0] + 1}`} · ${columnLabels[shown[1]] ?? `Column ${shown[1] + 1}`} · ${formatValue(value(...shown))}` : 'Hover or focus a cell'

  return (
    <div className={cn('w-full', className)}>
      <p className="mb-2 h-4 text-xs tabular-nums text-muted-foreground" aria-live="polite">{readout}</p>
      <div ref={grid} role="grid" aria-label={label} aria-rowcount={rows} aria-colcount={cols} onKeyDown={onKeyDown} className="flex gap-2">
        <div aria-hidden="true" className="flex w-12 shrink-0 flex-col gap-px text-right text-[10px] tabular-nums text-muted-foreground">
          {rowLabels.map((l, i) => (
            <span key={i} className={cn('leading-none', i === markerRow && 'font-semibold text-foreground')} style={{ height: 14 }}>{l}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid gap-px overflow-hidden rounded-md" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => {
                const v = value(r, c)
                return (
                  <div
                    key={`${r}-${c}`}
                    role="gridcell"
                    data-cell={`${r}-${c}`}
                    data-marker={r === markerRow ? '' : undefined}
                    tabIndex={focus[0] === r && focus[1] === c ? 0 : -1}
                    aria-label={`${rowLabels[r] ?? `Row ${r + 1}`}, ${columnLabels[c] ?? `Column ${c + 1}`}: ${formatValue(v)}`}
                    onFocus={() => {
                      setFocus([r, c])
                      setShown([r, c])
                    }}
                    onMouseEnter={() => setShown([r, c])}
                    onMouseLeave={() => setShown(null)}
                    onBlur={() => setShown(null)}
                    className={cn('relative h-3.5 bg-muted outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring', r === markerRow && 'shadow-[inset_0_1px_0_0_var(--foreground),inset_0_-1px_0_0_var(--foreground)]')}
                  >
                    <span aria-hidden="true" className="absolute inset-0 bg-primary" style={{ opacity: Math.min(1, v / max) }} />
                  </div>
                )
              }),
            )}
          </div>
          <div aria-hidden="true" className="mt-1 flex justify-between text-[10px] tabular-nums text-muted-foreground">
            <span>{columnLabels[0]}</span>
            <span>{columnLabels[cols - 1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
