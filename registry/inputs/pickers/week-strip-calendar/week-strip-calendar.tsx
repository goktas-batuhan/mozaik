// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/calender/week-strip-calendar.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type Ref, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function startOfWeek(date: Date) {
  const copy = startOfDay(date)
  copy.setDate(copy.getDate() - copy.getDay())
  return copy
}

function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export interface WeekStripCalendarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  /** Controlled selected day. */
  value?: Date
  /** Initially selected day when uncontrolled. Defaults to today. */
  defaultValue?: Date
  /** Called with the picked day, at local midnight. */
  onChange?: (date: Date) => void
  ref?: Ref<HTMLDivElement>
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} />
    </svg>
  )
}

const navButton =
  'flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring'

/** A one-week strip: step between weeks with the arrows, tap a day to select it. */
export function WeekStripCalendar({ value, defaultValue, onChange, className, ref, ...props }: WeekStripCalendarProps) {
  const reduced = usePrefersReducedMotion()
  const today = useMemo(() => startOfDay(new Date()), [])
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(() => startOfDay(defaultValue ?? today))
  const selected = isControlled ? startOfDay(value) : internal
  const [weekStart, setWeekStart] = useState(() => startOfWeek(selected))
  const [direction, setDirection] = useState(0)

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const monthLabel = days[3].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const short = { month: 'short', day: 'numeric' } as const
  const rangeLabel = `${days[0].toLocaleDateString('en-US', short)} – ${days[6].toLocaleDateString('en-US', short)}`

  const pick = (date: Date) => {
    const day = startOfDay(date)
    if (!isControlled) setInternal(day)
    onChange?.(day)
  }

  const go = (delta: -1 | 1) => {
    setDirection(delta)
    setWeekStart((prev) => addDays(prev, delta * 7))
  }

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'w-80 overflow-hidden rounded-2xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm select-none',
        className,
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-semibold">{monthLabel}</p>
        <div className="flex items-center gap-0.5">
          <button type="button" aria-label="Previous week" onClick={() => go(-1)} className={navButton}>
            <ChevronIcon direction="left" />
          </button>
          <button type="button" aria-label="Next week" onClick={() => go(1)} className={navButton}>
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      <p
        key={rangeLabel}
        aria-live="polite"
        className={cn(
          'mb-4 text-xs font-medium text-muted-foreground opacity-100',
          !reduced && 'transition-opacity duration-300 ease-out starting:opacity-0',
        )}
      >
        {rangeLabel}
      </p>

      <div
        key={weekStart.toISOString()}
        role="group"
        aria-label={`Week of ${rangeLabel}`}
        className={cn(
          'grid grid-cols-7 opacity-100',
          !reduced &&
            cn(
              'transition-all duration-300 ease-out starting:opacity-0',
              direction >= 0 ? 'starting:translate-x-2' : 'starting:-translate-x-2',
            ),
        )}
      >
        {days.map((date) => {
          const isSelected = isSameDate(date, selected)
          const isToday = isSameDate(date, today)
          return (
            <button
              key={date.toISOString()}
              type="button"
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              onClick={() => pick(date)}
              className="group flex cursor-pointer flex-col items-center gap-1.5 outline-none"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'text-[10px] font-medium tracking-wide uppercase',
                  isSelected ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'relative flex size-9 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors duration-150',
                  'group-focus-visible:outline-2 group-focus-visible:outline-offset-1 group-focus-visible:outline-ring',
                  isSelected && 'bg-primary font-semibold text-primary-foreground',
                  !isSelected && isToday && 'bg-muted font-semibold text-foreground group-hover:bg-accent',
                  !isSelected && !isToday && 'text-foreground/80 group-hover:bg-muted',
                )}
              >
                {date.getDate()}
                {isToday && !isSelected && (
                  <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
