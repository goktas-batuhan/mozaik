// Source: original
import type { ReactNode } from 'react'
import { Sparkline } from '@/components/sparkline'
import { cn } from '@/lib/utils'

export interface KpiCardProps {
  /** Name of the metric. */
  label: string
  /** The headline number or text. Numbers are formatted with en-US grouping. */
  value: number | string
  /** Text before the value, such as "$". */
  prefix?: string
  /** Text after the value, such as "%" or " ms". */
  suffix?: string
  /** Change since the last period, in percent. Positive is up. */
  delta?: number
  /** Count a falling number as good news, for metrics like errors or cost. */
  lowerIsBetter?: boolean
  /** Words after the delta, such as "vs last week". */
  deltaLabel?: string
  /** Recent values for a sparkline in the corner, oldest first. */
  trend?: number[]
  /** Icon at the top right. Decorative. */
  icon?: ReactNode
  className?: string
}

/** A metric card: label, big number, change since last period and an optional sparkline. */
export function KpiCard({ label, value, prefix, suffix, delta, lowerIsBetter = false, deltaLabel, trend, icon, className }: KpiCardProps) {
  const shown = typeof value === 'number' ? value.toLocaleString('en-US') : value
  const flat = delta === undefined || delta === 0
  const up = (delta ?? 0) > 0
  const good = flat ? null : up !== lowerIsBetter
  const tone = good === null ? 'muted' : good ? 'success' : 'destructive'

  return (
    <div data-slot="kpi-card" className={cn('flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}>
      <div className="flex h-5 items-center justify-between gap-2">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        {icon ? (
          <span aria-hidden className="shrink-0 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="min-w-0 truncate text-3xl leading-9 font-semibold tracking-tight tabular-nums">
          {prefix}
          {shown}
          {suffix}
        </p>
        {trend && trend.length > 1 ? <Sparkline data={trend} tone={tone} width={88} height={32} label={`${label} trend`} /> : null}
      </div>
      {delta !== undefined ? (
        <p className="flex h-5 items-center gap-1.5 text-sm" data-tone={tone}>
          <span className={cn('inline-flex items-center gap-0.5 font-medium tabular-nums', good === null ? 'text-muted-foreground' : good ? 'text-success' : 'text-destructive')}>
            <svg aria-hidden viewBox="0 0 12 12" className={cn('size-3', !up && !flat && 'rotate-180', flat && 'hidden')} fill="currentColor">
              <path d="M6 2 11 9H1z" />
            </svg>
            <span className="sr-only">{flat ? 'Unchanged' : up ? 'Up' : 'Down'} </span>
            {Math.abs(delta).toLocaleString('en-US', { maximumFractionDigits: 1 })}%
          </span>
          {deltaLabel ? <span className="text-muted-foreground">{deltaLabel}</span> : null}
        </p>
      ) : null}
    </div>
  )
}
