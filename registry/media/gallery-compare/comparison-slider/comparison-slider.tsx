// Source: haydenbleasel/kibo (MIT) — https://github.com/haydenbleasel/kibo/blob/main/packages/comparison/index.tsx
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ComparisonSliderProps {
  /** Shown on the left of the divider. */
  before: ReactNode
  /** Shown on the right of the divider. */
  after: ReactNode
  beforeLabel?: string
  afterLabel?: string
  /** Controlled divider position, 0 to 100. Pair with onPositionChange. */
  position?: number
  /** Divider position when uncontrolled. */
  defaultPosition?: number
  onPositionChange?: (position: number) => void
  /** Move the divider as the pointer moves, without pressing. */
  hover?: boolean
  /** Arrow-key step in percent. */
  step?: number
  /** Accessible name of the slider. */
  label?: string
  className?: string
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

/** Two layers split by a draggable divider. The divider is a keyboard-operable slider. */
export function ComparisonSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  position,
  defaultPosition = 50,
  onPositionChange,
  hover = false,
  step = 5,
  label = 'Comparison position',
  className,
}: ComparisonSliderProps) {
  const [inner, setInner] = useState(clamp(defaultPosition))
  const value = clamp(position ?? inner)
  const root = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const commit = useCallback(
    (next: number) => {
      const v = clamp(next)
      if (position === undefined) setInner(v)
      onPositionChange?.(v)
    },
    [position, onPositionChange],
  )

  const fromPointer = (event: PointerEvent) => {
    const rect = root.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    commit(((event.clientX - rect.left) / rect.width) * 100)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowLeft: value - step,
      ArrowDown: value - step,
      ArrowRight: value + step,
      ArrowUp: value + step,
      PageDown: value - step * 4,
      PageUp: value + step * 4,
      Home: 0,
      End: 100,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    commit(keys[event.key])
  }

  return (
    <div
      ref={root}
      className={cn('relative isolate w-full touch-pan-y select-none overflow-hidden rounded-xl border border-border bg-muted', className)}
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture?.(event.pointerId)
        fromPointer(event)
      }}
      onPointerMove={(event) => {
        if (dragging.current || hover) fromPointer(event)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onPointerCancel={() => {
        dragging.current = false
      }}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }} data-testid="before-layer">
        {before}
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground">{beforeLabel}</span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-background" style={{ left: `${value}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value)}
          aria-valuetext={`${Math.round(value)}% ${beforeLabel}, ${Math.round(100 - value)}% ${afterLabel}`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
