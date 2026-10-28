// Source: starc007/ui-components (MIT) — https://github.com/starc007/ui-components/blob/main/components/charts/candlestick-chart.tsx
import { motion, useReducedMotion, useReducedMotionConfig, type Transition } from 'motion/react'
import { useCallback, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const SPRING: Transition = { type: 'spring', stiffness: 380, damping: 36 }

/** The SVG is drawn in a 1000-unit wide box and stretched to the container, so it needs no resize observer. */
const BOX_W = 1000
/** Share of the width kept for the plot; the right gutter holds the price labels. */
const PLOT_W = 920
const VOLUME_SHARE = 0.18
const GAP = 8
/** Scale from the shape's own top edge rather than its centre. */
const TOP_ORIGIN = { originX: 0, originY: 0 } as const

export interface Candle {
  /** Stable id, such as the open timestamp. */
  id: string
  /** Axis and readout label, such as '14:05'. */
  label: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CandlestickChartProps {
  candles: readonly Candle[]
  /** Draws a dashed line and tag at this price, usually the last trade. */
  lastPrice?: number
  /** Controlled crosshair candle, by id, so it stays on the same candle as new ones arrive. Pair with onActiveIdChange. */
  activeId?: string | null
  defaultActiveId?: string | null
  onActiveIdChange?: (id: string | null) => void
  formatPrice?: (value: number) => string
  formatVolume?: (value: number) => string
  /** Accessible name for the chart. */
  label?: string
  /** Plot height in px. */
  height?: number
  /** Shows the OHLC and volume readout above the plot. */
  showLegend?: boolean
  className?: string
}

const defaultPrice = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })
const defaultVolume = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

const UP = 'fill-[var(--success)] stroke-[var(--success)]'
const DOWN = 'fill-destructive stroke-destructive'

/** OHLC candles with volume, a last-price line and a crosshair readout, in plain SVG. */
export function CandlestickChart({
  candles,
  lastPrice,
  activeId,
  defaultActiveId = null,
  onActiveIdChange,
  formatPrice = defaultPrice,
  formatVolume = defaultVolume,
  label = 'Candlestick chart',
  height = 320,
  showLegend = true,
  className,
}: CandlestickChartProps) {
  const reduced = usePrefersReducedMotion()
  const [internalActive, setInternalActive] = useState(defaultActiveId)
  const [pointerY, setPointerY] = useState<number | null>(null)

  // Resolve the crosshair by id during render: a candle that scrolled out of
  // the window clears it rather than landing on a neighbour.
  const rawActive = activeId === undefined ? internalActive : activeId
  const found = rawActive === null ? -1 : candles.findIndex((candle) => candle.id === rawActive)
  const active = found >= 0 ? found : null

  const setActive = useCallback(
    (next: number | null) => {
      const id = next === null ? null : (candles[next]?.id ?? null)
      if (activeId === undefined) setInternalActive(id)
      onActiveIdChange?.(id)
    },
    [candles, activeId, onActiveIdChange],
  )

  const scale = useMemo(() => {
    const lows = candles.map((c) => c.low)
    const highs = candles.map((c) => c.high)
    if (lastPrice !== undefined) {
      lows.push(lastPrice)
      highs.push(lastPrice)
    }
    const min = lows.length ? Math.min(...lows) : 0
    const max = highs.length ? Math.max(...highs) : 1
    const pad = Math.max((max - min) * 0.08, max * 0.0005, 0.0001)
    const volumeMax = Math.max(1, ...candles.map((c) => c.volume))
    return { min: min - pad, max: max + pad, volumeMax }
  }, [candles, lastPrice])

  const priceHeight = height * (1 - VOLUME_SHARE) - GAP
  const slot = candles.length ? PLOT_W / candles.length : 0
  const body = Math.max(1, slot * 0.62)
  const y = (price: number) => ((scale.max - price) / (scale.max - scale.min || 1)) * priceHeight
  const priceAt = (py: number) => scale.max - (py / priceHeight) * (scale.max - scale.min)
  const ticks = Array.from({ length: 5 }, (_, i) => scale.max - ((scale.max - scale.min) * (i + 0.5)) / 5)
  const spring: Transition = reduced ? { duration: 0 } : SPRING

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !slot) return
    const x = ((event.clientX - rect.left) / rect.width) * BOX_W
    const py = event.clientY - rect.top
    if (x > PLOT_W) return
    setActive(Math.min(candles.length - 1, Math.max(0, Math.floor(x / slot))))
    setPointerY(py <= priceHeight ? py : null)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const current = active ?? candles.length - 1
    let next: number | null
    if (event.key === 'ArrowLeft') next = Math.max(0, current - 1)
    else if (event.key === 'ArrowRight') next = Math.min(candles.length - 1, current + 1)
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = candles.length - 1
    else if (event.key === 'Escape') next = null
    else return
    event.preventDefault()
    setPointerY(null)
    setActive(next)
  }

  const focus = active !== null ? candles[active] : candles.at(-1)
  const crossX = active !== null ? active * slot + slot / 2 : null
  const change = focus && focus.open ? ((focus.close - focus.open) / focus.open) * 100 : 0
  const tone = change >= 0 ? 'text-[var(--success)]' : 'text-destructive'

  const first = candles[0]
  const last = candles.at(-1)
  const lastChange = last && last.open ? ((last.close - last.open) / last.open) * 100 : 0
  const summary =
    first && last
      ? `${label}: ${candles.length} candles from ${first.label} to ${last.label}, low ${formatPrice(Math.min(...candles.map((c) => c.low)))}, high ${formatPrice(Math.max(...candles.map((c) => c.high)))}, last close ${formatPrice(last.close)}, ${lastChange >= 0 ? 'up' : 'down'} ${Math.abs(lastChange).toFixed(2)}% on the last candle`
      : `${label}: no data`

  return (
    <div className={cn('grid w-full gap-3', className)}>
      {showLegend && focus ? (
        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tabular-nums">
          <dt className="sr-only">Candle</dt>
          <dd className="text-muted-foreground">{focus.label}</dd>
          {(
            [
              ['O', formatPrice(focus.open)],
              ['H', formatPrice(focus.high)],
              ['L', formatPrice(focus.low)],
              ['C', formatPrice(focus.close)],
              ['Vol', formatVolume(focus.volume)],
            ] as const
          ).map(([term, value]) => (
            <div key={term} className="flex gap-1">
              <dt className="text-muted-foreground">{term}</dt>
              <dd className={term === 'Vol' ? 'text-foreground' : tone}>{value}</dd>
            </div>
          ))}
          <dd className={tone}>
            {change >= 0 ? '+' : '−'}
            {Math.abs(change).toFixed(2)}%
          </dd>
        </dl>
      ) : null}

      <div className="relative w-full" style={{ height }}>
        <svg
          role="img"
          aria-label={summary}
          viewBox={`0 0 ${BOX_W} ${height}`}
          preserveAspectRatio="none"
          width="100%"
          height={height}
          className="absolute inset-0 overflow-visible"
        >
          {ticks.map((tick) => (
            <line key={tick} x1={0} x2={PLOT_W} y1={y(tick)} y2={y(tick)} className="stroke-border" vectorEffect="non-scaling-stroke" strokeDasharray="2 6" />
          ))}
          {candles.map((candle, index) => {
            const up = candle.close >= candle.open
            const cx = index * slot + slot / 2
            const top = y(Math.max(candle.open, candle.close))
            const bodyHeight = Math.max(1, Math.abs(y(candle.open) - y(candle.close)))
            const wickTop = y(candle.high)
            const wickHeight = Math.max(1, y(candle.low) - wickTop)
            const volumeHeight = Math.max(0.5, (candle.volume / scale.volumeMax) * height * VOLUME_SHARE)
            const dimmed = active !== null && active !== index
            return (
              <motion.g
                key={candle.id}
                data-trend={up ? 'up' : 'down'}
                className={up ? UP : DOWN}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: dimmed ? 0.45 : 1 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT, delay: reduced ? 0 : Math.min(index * 0.012, 0.6) }}
              >
                <motion.line
                  x1={cx}
                  x2={cx}
                  y1={0}
                  y2={1}
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={1}
                  style={TOP_ORIGIN}
                  initial={false}
                  animate={{ y: wickTop, scaleY: wickHeight }}
                  transition={spring}
                />
                <motion.rect x={cx - body / 2} y={0} width={body} height={1} strokeWidth={0} style={TOP_ORIGIN} initial={false} animate={{ y: top, scaleY: bodyHeight }} transition={spring} />
                <motion.rect
                  x={cx - body / 2}
                  y={0}
                  width={body}
                  height={1}
                  strokeWidth={0}
                  opacity={0.28}
                  style={TOP_ORIGIN}
                  initial={false}
                  animate={{ y: height - volumeHeight, scaleY: volumeHeight }}
                  transition={spring}
                />
              </motion.g>
            )
          })}
          {lastPrice !== undefined ? (
            <motion.line
              x1={0}
              x2={PLOT_W}
              y1={0}
              y2={0}
              initial={false}
              animate={{ y: y(lastPrice) }}
              transition={spring}
              className="stroke-foreground"
              strokeOpacity={0.45}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {crossX !== null ? <line x1={crossX} x2={crossX} y1={0} y2={height} className="stroke-foreground" strokeOpacity={0.3} vectorEffect="non-scaling-stroke" /> : null}
          {pointerY !== null ? <line x1={0} x2={PLOT_W} y1={pointerY} y2={pointerY} className="stroke-foreground" strokeOpacity={0.3} vectorEffect="non-scaling-stroke" /> : null}
        </svg>

        {ticks.map((tick) => (
          <span
            key={tick}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 -translate-y-1/2 pr-1 font-mono text-xs tabular-nums text-muted-foreground"
            style={{ top: y(tick) }}
          >
            {formatPrice(tick)}
          </span>
        ))}
        {lastPrice !== undefined ? (
          <motion.div aria-hidden="true" className="pointer-events-none absolute right-0 top-0" initial={false} animate={{ y: y(lastPrice) }} transition={spring}>
            <span className="block -translate-y-1/2 rounded-md bg-foreground px-1.5 py-0.5 font-mono text-xs tabular-nums text-background">{formatPrice(lastPrice)}</span>
          </motion.div>
        ) : null}
        {pointerY !== null ? (
          <span aria-hidden="true" className="pointer-events-none absolute right-0 -translate-y-1/2 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums text-foreground" style={{ top: pointerY }}>
            {formatPrice(priceAt(pointerY))}
          </span>
        ) : null}

        {/* Keyboard and pointer layer: arrows, Home, End and Escape move the crosshair. */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`${label}: inspect candles`}
          aria-valuemin={0}
          aria-valuemax={Math.max(0, candles.length - 1)}
          aria-valuenow={active ?? Math.max(0, candles.length - 1)}
          aria-valuetext={
            focus
              ? `${focus.label}: open ${formatPrice(focus.open)}, high ${formatPrice(focus.high)}, low ${formatPrice(focus.low)}, close ${formatPrice(focus.close)}`
              : undefined
          }
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            setActive(null)
            setPointerY(null)
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="absolute inset-0 cursor-crosshair touch-pan-y select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  )
}
