// Source: starc007/ui-components (MIT) — https://github.com/starc007/ui-components/blob/main/components/charts/volume-profile.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useMemo, useState, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const SPRING = { type: 'spring', stiffness: 380, damping: 36 } as const

export interface VolumeProfileBin {
  /** Stable identity for this price range across data updates. */
  id: string
  priceLow: number
  priceHigh: number
  /** Executed volume in this range, in the unit you choose. */
  volume: number
}

export interface VolumeProfileProps {
  /** Already-aggregated executed volume. Unequal bins and gaps are supported; ranges must not overlap. */
  data: readonly VolumeProfileBin[]
  /** Accessible name; the chart's text summary starts with it. */
  label?: string
  /** Unit shown after volumes, e.g. 'ETH'. */
  unit?: string
  formatPrice?: (price: number) => string
  formatVolume?: (volume: number) => string
  /** Target fraction of total volume for the value area (default 0.7). Whole bins may cover less; the POC is always included. Set false to hide it. */
  valueArea?: number | false
  /** Controlled inspected bin id. Pair with onActiveChange. */
  activeId?: string | null
  defaultActiveId?: string | null
  onActiveChange?: (id: string | null) => void
  /** Plot height in px. */
  height?: number
  /** Shows the price and volume axes. */
  showAxes?: boolean
  /** Shows total volume, point of control and value area under the plot. */
  showSummary?: boolean
  className?: string
}

const formatNumber = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 })

function buildVolumeProfile(data: readonly VolumeProfileBin[], target: number | false) {
  if (target !== false && (!Number.isFinite(target) || target <= 0 || target > 1))
    throw new Error('VolumeProfile: valueArea must be a fraction above 0 and at most 1, or false.')
  const bins = [...data].sort((a, b) => a.priceLow - b.priceLow)
  const ids = new Set<string>()
  let totalVolume = 0
  let maxVolume = 0
  let pocIndex = -1
  for (const [index, bin] of bins.entries()) {
    if (ids.has(bin.id)) throw new Error(`VolumeProfile: duplicate bin ID "${bin.id}".`)
    ids.add(bin.id)
    if (!Number.isFinite(bin.priceLow) || !Number.isFinite(bin.priceHigh) || bin.priceHigh <= bin.priceLow || !Number.isFinite(bin.volume) || bin.volume < 0)
      throw new Error('VolumeProfile: bins need finite increasing price bounds and nonnegative volume.')
    if (index > 0 && bin.priceLow < bins[index - 1].priceHigh) throw new Error('VolumeProfile: price ranges must not overlap.')
    totalVolume += bin.volume
    // Equal maxima keep the lower-price bin as a deterministic POC.
    if (bin.volume > maxVolume) {
      maxVolume = bin.volume
      pocIndex = index
    }
  }
  const priceLow = bins[0]?.priceLow ?? 0
  const priceHigh = bins.at(-1)?.priceHigh ?? 1
  const span = priceHigh - priceLow
  let lowIndex = pocIndex
  let highIndex = pocIndex
  let areaVolume = pocIndex >= 0 ? bins[pocIndex].volume : 0
  if (target === 1 && pocIndex >= 0) {
    lowIndex = 0
    highIndex = bins.length - 1
    areaVolume = totalVolume
  } else if (target !== false && pocIndex >= 0) {
    const targetVolume = totalVolume * target
    // Grow a contiguous area from the POC using the larger adjacent volume.
    // Stop before adding a row that would exceed the target; the POC is always in.
    while (areaVolume < targetVolume) {
      const below = bins[lowIndex - 1]
      const above = bins[highIndex + 1]
      if (!below && !above) break
      const takeAbove =
        !below || (!!above && (above.volume > below.volume || (above.volume === below.volume && highIndex + 1 - pocIndex <= pocIndex - (lowIndex - 1))))
      const next = takeAbove ? above : below
      if (!next || areaVolume + next.volume > targetVolume) break
      areaVolume += next.volume
      if (takeAbove) highIndex++
      else lowIndex--
    }
  }
  const area =
    target !== false && pocIndex >= 0
      ? { priceLow: bins[lowIndex].priceLow, priceHigh: bins[highIndex].priceHigh, volume: areaVolume, share: areaVolume / totalVolume, target }
      : null
  const rows = bins.map((bin, index) => {
    const center = bin.priceLow + (bin.priceHigh - bin.priceLow) / 2
    return {
      ...bin,
      price: center,
      top: (priceHigh - bin.priceHigh) / span,
      height: (bin.priceHigh - bin.priceLow) / span,
      center: (priceHigh - center) / span,
      proportion: maxVolume ? bin.volume / maxVolume : 0,
      share: totalVolume ? bin.volume / totalVolume : 0,
      isPoc: index === pocIndex,
      inValueArea: area !== null && index >= lowIndex && index <= highIndex,
    }
  })
  return { rows, poc: rows[pocIndex] ?? null, valueArea: area, totalVolume, maxVolume, priceLow, priceHigh }
}

/** Volume traded at each price level, with the point of control and value area, in plain SVG. */
export function VolumeProfile({
  data,
  label = 'Volume profile',
  unit = 'units',
  formatPrice = formatNumber,
  formatVolume = formatNumber,
  valueArea = 0.7,
  activeId,
  defaultActiveId = null,
  onActiveChange,
  height = 320,
  showAxes = true,
  showSummary = true,
  className,
}: VolumeProfileProps) {
  const reduced = usePrefersReducedMotion()
  const model = useMemo(() => buildVolumeProfile(data, valueArea), [data, valueArea])
  const { rows, poc, totalVolume, maxVolume, priceLow, priceHigh } = model
  const area = model.valueArea

  const [internalId, setInternalId] = useState(defaultActiveId)
  const requestedId = activeId === undefined ? internalId : activeId
  const activeIndex = rows.findIndex((row) => row.id === requestedId)
  const activeRow = rows[activeIndex] ?? null
  const [inspecting, setInspecting] = useState(false)

  const setActive = (id: string | null) => {
    if (activeId === undefined) setInternalId(id)
    if (requestedId !== id) onActiveChange?.(id)
  }

  const describe = (row: (typeof rows)[number]) =>
    [
      `${formatPrice(row.priceLow)} to ${formatPrice(row.priceHigh)}`,
      `${formatVolume(row.volume)} ${unit}`,
      `${(row.share * 100).toFixed(1)}% of total volume`,
      row.isPoc ? 'Point of control' : row.inValueArea ? 'Inside value area' : null,
    ]
      .filter(Boolean)
      .join('. ')

  const summary = poc
    ? `${label}: ${rows.length} price levels from ${formatPrice(priceLow)} to ${formatPrice(priceHigh)}, ${formatVolume(totalVolume)} ${unit} in total, point of control at ${formatPrice(poc.price)}${area ? `, value area ${formatPrice(area.priceLow)} to ${formatPrice(area.priceHigh)}` : ''}`
    : `${label}: no data`

  const inspect = (event: PointerEvent<HTMLInputElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.height) return
    const fraction = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
    // Hit-test real price geometry, including unequal bins and empty price gaps.
    const match =
      rows.find((item) => fraction >= item.top && fraction <= item.top + item.height) ??
      rows.reduce((nearest, item) => (Math.abs(item.center - fraction) < Math.abs(nearest.center - fraction) ? item : nearest))
    setActive(match.id)
    setInspecting(true)
  }

  const index = Math.max(activeIndex, 0)
  const axisPositions = [1, 0.75, 0.5, 0.25, 0]

  return (
    <section aria-label={label} data-slot="volume-profile" className={cn('w-full min-w-0 space-y-5', className)}>
      {rows.length === 0 ? (
        <p role="img" aria-label={summary} className="py-12 text-center text-sm text-muted-foreground">
          No volume data
        </p>
      ) : (
        <div className={cn('min-w-0', showAxes && 'pb-6')}>
          <div className="flex min-w-0 gap-3" style={{ height }}>
            {showAxes ? (
              <div aria-hidden="true" className="relative shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground sm:text-xs">
                {axisPositions.map((position) => {
                  const text = formatPrice(priceLow + (priceHigh - priceLow) * position)
                  return (
                    <span key={position}>
                      <span className="invisible block">{text}</span>
                      <span className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - position) * 100}%` }}>
                        {text}
                      </span>
                    </span>
                  )
                })}
              </div>
            ) : null}

            <div className="relative min-w-0 flex-1 rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ring">
              <svg role="img" aria-label={summary} viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
                {[0, 25, 50, 75, 100].map((x) => (
                  <line key={x} x1={x} x2={x} y1={0} y2={100} className="stroke-border" strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
                ))}
                {rows.map((item, i) => {
                  const bar = Math.max(0, item.height * 100 - 0.4)
                  const y = item.top * 100 + 0.2
                  const inside = item.isPoc || item.inValueArea || !area
                  return (
                    <g key={item.id} data-volume-bin={item.id} data-poc={item.isPoc || undefined} data-value-area={item.inValueArea || undefined}>
                      <motion.rect
                        x={0}
                        y={y}
                        height={bar}
                        className={item.isPoc ? 'fill-foreground' : 'fill-primary'}
                        initial={reduced ? false : { width: 0, opacity: 0 }}
                        animate={{ width: item.proportion * 100, opacity: inside ? 0.9 : 0.3 }}
                        transition={{ width: reduced ? { duration: 0 } : SPRING, opacity: { duration: reduced ? 0 : 0.18, ease: EASE_OUT } }}
                      />
                      {inspecting && activeIndex === i ? <rect x={0} y={item.top * 100} width={100} height={item.height * 100} className="fill-foreground" opacity={0.06} /> : null}
                      {item.isPoc ? (
                        <line x1={0} x2={100} y1={item.center * 100} y2={item.center * 100} className="stroke-foreground" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
                      ) : null}
                    </g>
                  )
                })}
              </svg>

              {poc ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 -translate-y-1/2 rounded bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground"
                  style={{ top: `${poc.center * 100}%` }}
                >
                  POC
                </span>
              ) : null}

              <input
                type="range"
                min={0}
                max={rows.length - 1}
                step={1}
                value={index}
                aria-label={`${label}: inspect price level`}
                aria-orientation="vertical"
                aria-valuetext={describe(rows[index])}
                className="absolute inset-0 m-0 size-full cursor-crosshair opacity-0"
                style={{ writingMode: 'vertical-lr', direction: 'rtl', touchAction: 'pan-x' }}
                onFocus={() => {
                  if (activeIndex < 0) setActive(rows[index].id)
                  setInspecting(true)
                }}
                onBlur={() => setInspecting(false)}
                onPointerMove={(event) => {
                  if (event.pointerType !== 'touch' || event.buttons === 1) inspect(event)
                }}
                onPointerDown={inspect}
                onPointerLeave={() => {
                  setInspecting(false)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setInspecting(false)
                }}
                onChange={(event) => {
                  const next = rows[Number(event.target.value)]
                  if (next) {
                    setActive(next.id)
                    setInspecting(true)
                  }
                }}
              />

              {showAxes ? (
                <div aria-hidden="true" className="absolute inset-x-0 top-full mt-2 flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground sm:text-xs">
                  <span>0</span>
                  <span>{formatVolume(maxVolume / 2)}</span>
                  <span>{formatVolume(maxVolume)}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {rows.length > 0 ? (
        <p aria-live="polite" className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tabular-nums text-muted-foreground">
          {inspecting && activeRow ? (
            <>
              <span className="font-medium text-foreground">
                {formatPrice(activeRow.priceLow)} – {formatPrice(activeRow.priceHigh)}
              </span>
              <span>
                {formatVolume(activeRow.volume)} {unit} · {(activeRow.share * 100).toFixed(1)}%
              </span>
              {activeRow.isPoc || activeRow.inValueArea ? <span>{activeRow.isPoc ? 'Point of control' : 'Inside value area'}</span> : null}
            </>
          ) : (
            <span className="font-sans">Hover or focus a level to read its volume</span>
          )}
        </p>
      ) : null}

      {showSummary && rows.length > 0 ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-4 text-xs sm:grid-cols-3">
          <div className="space-y-1.5">
            <dt className="text-muted-foreground">Total volume</dt>
            <dd className="font-mono font-medium tabular-nums">
              {formatVolume(totalVolume)} {unit}
            </dd>
          </div>
          <div className="space-y-1.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground" />
              Point of control
            </dt>
            <dd className="font-mono font-medium tabular-nums">{poc ? formatPrice(poc.price) : '—'}</dd>
          </div>
          {area ? (
            <div className="col-span-2 space-y-1.5 sm:col-span-1">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                Value area · {Math.round(area.target * 100)}% target
              </dt>
              <dd className="font-mono font-medium tabular-nums">
                {formatPrice(area.priceLow)} – {formatPrice(area.priceHigh)}
              </dd>
              <dd className="text-muted-foreground">{(area.share * 100).toFixed(1)}% of volume</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <div className="sr-only">
        <table>
          <caption>{label} data</caption>
          <thead>
            <tr>
              <th scope="col">Price range</th>
              <th scope="col">Volume ({unit})</th>
              <th scope="col">Share</th>
              <th scope="col">Level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  {formatPrice(row.priceLow)} to {formatPrice(row.priceHigh)}
                </th>
                <td>{formatVolume(row.volume)}</td>
                <td>{(row.share * 100).toFixed(1)}%</td>
                <td>{row.isPoc ? 'Point of control' : row.inValueArea ? 'Inside value area' : area ? 'Outside value area' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
