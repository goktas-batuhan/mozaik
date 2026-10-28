// Source: original
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface HeatmapCalendarProps {
  /** One count per day, oldest first. The first value is the first day of the first week. */
  values: number[]
  /** Called when a day is picked with the mouse or the keyboard. */
  onSelect?: (index: number, value: number) => void
  /** Noun for the caption, such as "commits". */
  unit?: string
  /** Size of a day in pixels. */
  cell?: number
  /** Gap between days in pixels. */
  gap?: number
  /** Accessible name of the grid. */
  label?: string
  className?: string
}

const LEVELS = ['bg-muted', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary']

const level = (v: number, max: number) => (v <= 0 || max <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)))

/** A contribution-style grid: weeks in columns, days in rows, darker for busier days. */
export function HeatmapCalendar({ values, onSelect, unit = 'events', cell = 12, gap = 3, label = 'Activity', className }: HeatmapCalendarProps) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(0, ...values)
  const total = values.reduce((a, b) => a + b, 0)
  const weeks = Math.ceil(values.length / 7)
  const shown = active === null ? null : values[active]

  return (
    <div data-slot="heatmap-calendar" className={cn('inline-flex flex-col gap-2', className)}>
      <div
        role="group"
        aria-label={`${label}: ${total} ${unit} over ${values.length} days`}
        className="grid"
        style={{ gridTemplateRows: `repeat(7, ${cell}px)`, gridAutoFlow: 'column', gridAutoColumns: `${cell}px`, gap, width: weeks * cell + Math.max(0, weeks - 1) * gap }}
      >
        {values.map((v, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Day ${i + 1}: ${v} ${unit}`}
            data-level={level(v, max)}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => onSelect?.(i, v)}
            className={cn('cursor-pointer rounded-[3px] focus-visible:outline-2 focus-visible:outline-ring', LEVELS[level(v, max)])}
            style={{ width: cell, height: cell }}
          />
        ))}
      </div>
      <div className="flex h-4 items-center justify-between gap-3 text-xs text-muted-foreground">
        <span aria-live="polite" className="tabular-nums">
          {active === null ? `${total} ${unit} in total` : `Day ${active + 1}: ${shown} ${unit}`}
        </span>
        <span aria-hidden className="flex items-center gap-1">
          Less
          {LEVELS.map((c) => (
            <span key={c} className={cn('size-2.5 rounded-[2px]', c)} />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
