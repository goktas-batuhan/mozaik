// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/duration-picker/index.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type DurationUnit = 'hours' | 'minutes' | 'seconds'

export interface DurationPickerProps {
  /** Controlled value in seconds. */
  value?: number
  /** Initial value in seconds when uncontrolled. */
  defaultValue?: number
  /** Called whenever the duration changes, with the new value in seconds. */
  onChange?: (value: number) => void
  /** Which unit segments to show, most significant first. */
  units?: DurationUnit[]
  /** Minimum total duration in seconds. */
  min?: number
  /** Maximum total duration in seconds. */
  max?: number
  /** Amount added per arrow key press, in the focused unit. */
  step?: number
  /** Drag a segment sideways to scrub its value. */
  scrub?: boolean
  /** Disables all interaction. */
  disabled?: boolean
  /** Visible label above the picker. */
  label?: string
  className?: string
}

const UNIT_ORDER: DurationUnit[] = ['hours', 'minutes', 'seconds']
const UNIT_DIVISOR: Record<DurationUnit, number> = { hours: 3600, minutes: 60, seconds: 1 }
const UNIT_LABEL: Record<DurationUnit, string> = { hours: 'hour', minutes: 'minute', seconds: 'second' }

const DEFAULT_UNITS: DurationUnit[] = ['hours', 'minutes', 'seconds']
const SHIFT_MULTIPLIER = 10
const PAGE_STEP_MULTIPLIER = 5
const TYPE_BUFFER_MS = 600
const PX_PER_DRAG_STEP = 6
const DIGIT_HEIGHT = 24
const DIGIT_ROLL = 12
const DIGIT_KEY = /^[0-9]$/

const PAD = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2, useGrouping: false })

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

const sortUnits = (units: DurationUnit[]): DurationUnit[] => {
  const sorted = UNIT_ORDER.filter((u) => units.includes(u))
  return sorted.length > 0 ? sorted : DEFAULT_UNITS
}

const decompose = (totalSeconds: number, units: DurationUnit[]): number[] => {
  let remaining = Math.max(0, Math.trunc(totalSeconds))
  return units.map((unit) => {
    const part = Math.floor(remaining / UNIT_DIVISOR[unit])
    remaining -= part * UNIT_DIVISOR[unit]
    return part
  })
}

const segmentMax = (index: number, units: DurationUnit[], overallMax: number): number => {
  if (index === 0) return Math.floor(overallMax / UNIT_DIVISOR[units[0]])
  return Math.floor(UNIT_DIVISOR[units[index - 1]] / UNIT_DIVISOR[units[index]]) - 1
}

const pluralize = (count: number, unit: DurationUnit) => `${count} ${UNIT_LABEL[unit]}${count === 1 ? '' : 's'}`

/** Formats seconds as a padded, colon-separated string, e.g. `01:30:00`. */
export function formatDuration(totalSeconds: number, units: DurationUnit[] = DEFAULT_UNITS): string {
  const sorted = sortUnits(units)
  return decompose(totalSeconds, sorted)
    .map((v) => PAD.format(v))
    .join(':')
}

function AnimatedDigit({ char, reduced }: { char: string; reduced: boolean }) {
  return (
    <span className="relative inline-block w-[0.62em] text-center" style={{ height: DIGIT_HEIGHT }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          className="absolute inset-0 flex items-center justify-center"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -DIGIT_ROLL }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: DIGIT_ROLL }}
          transition={reduced ? { duration: 0 } : { type: 'spring', bounce: 0.1, duration: 0.25 }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Hours, minutes and seconds as separate segments you type into, step with the arrow keys or drag. */
export function DurationPicker({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  units = DEFAULT_UNITS,
  min = 0,
  max = 359_999,
  step = 1,
  scrub = true,
  disabled = false,
  label,
  className,
}: DurationPickerProps) {
  const reduced = usePrefersReducedMotion()
  const labelId = useId()
  const isControlled = controlledValue !== undefined
  const [internal, setInternal] = useState(() => clamp(defaultValue, min, max))
  const value = isControlled ? controlledValue : internal

  const sortedUnits = useMemo(() => sortUnits(units), [units])
  const values = useMemo(() => decompose(value, sortedUnits), [value, sortedUnits])

  const segmentRefs = useRef<(HTMLDivElement | null)[]>([])
  const dragRef = useRef<{ index: number; startX: number; startValue: number } | null>(null)
  const typingRef = useRef<{ index: number; text: string } | null>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  const setTotal = useCallback(
    (next: number) => {
      const clamped = clamp(Math.round(next), min, max)
      if (!isControlled) setInternal(clamped)
      onChange?.(clamped)
    },
    [isControlled, min, max, onChange],
  )

  const commitSegment = useCallback(
    (index: number, raw: number) => {
      const divisor = UNIT_DIVISOR[sortedUnits[index]]
      const current = decompose(value, sortedUnits)
      setTotal(value + (raw - current[index]) * divisor)
    },
    [sortedUnits, value, setTotal],
  )

  const clearTimer = useCallback(() => {
    if (typingTimer.current !== undefined) {
      clearTimeout(typingTimer.current)
      typingTimer.current = undefined
    }
  }, [])
  useEffect(() => clearTimer, [clearTimer])

  const focusSegment = useCallback((index: number) => segmentRefs.current[index]?.focus(), [])

  const commitTyped = useCallback(
    (index: number, text: string, advance: boolean) => {
      commitSegment(index, Number.parseInt(text, 10))
      typingRef.current = null
      clearTimer()
      if (advance) focusSegment(index + 1)
    },
    [commitSegment, clearTimer, focusSegment],
  )

  const handleDigit = useCallback(
    (index: number, digit: string) => {
      const isLast = index === sortedUnits.length - 1
      const current = typingRef.current
      clearTimer()
      if (current && current.index === index && current.text.length === 1) {
        commitTyped(index, current.text + digit, !isLast)
        return
      }
      typingRef.current = { index, text: digit }
      commitSegment(index, Number.parseInt(digit, 10))
      typingTimer.current = setTimeout(() => commitTyped(index, digit, !isLast), TYPE_BUFFER_MS)
    },
    [sortedUnits, clearTimer, commitTyped, commitSegment],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (disabled) return
    const divisor = UNIT_DIVISOR[sortedUnits[index]]
    const multiplier = event.shiftKey ? SHIFT_MULTIPLIER : 1

    if (DIGIT_KEY.test(event.key)) {
      event.preventDefault()
      handleDigit(index, event.key)
      return
    }
    const act = (fn: () => void) => {
      event.preventDefault()
      fn()
    }
    switch (event.key) {
      case 'ArrowUp':
        act(() => setTotal(value + step * multiplier * divisor))
        break
      case 'ArrowDown':
        act(() => setTotal(value - step * multiplier * divisor))
        break
      case 'PageUp':
        act(() => setTotal(value + step * PAGE_STEP_MULTIPLIER * divisor))
        break
      case 'PageDown':
        act(() => setTotal(value - step * PAGE_STEP_MULTIPLIER * divisor))
        break
      case 'Home':
        act(() => commitSegment(index, 0))
        break
      case 'End':
        act(() => commitSegment(index, segmentMax(index, sortedUnits, max)))
        break
      case 'ArrowRight':
        act(() => focusSegment(index + 1))
        break
      case 'ArrowLeft':
        act(() => focusSegment(index - 1))
        break
    }
  }

  const handleBlur = (index: number) => {
    if (typingRef.current?.index === index) {
      clearTimer()
      typingRef.current = null
    }
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
    if (!scrub || disabled) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragRef.current = { index, startValue: value, startX: event.clientX }
    setDraggingIndex(index)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const divisor = UNIT_DIVISOR[sortedUnits[drag.index]]
    const deltaSteps = Math.round((event.clientX - drag.startX) / PX_PER_DRAG_STEP)
    setTotal(drag.startValue + deltaSteps * step * divisor)
  }

  const handlePointerUp = () => {
    dragRef.current = null
    setDraggingIndex(null)
  }

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      {label ? (
        <span id={labelId} className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div
        role="group"
        aria-label={label ? undefined : 'Duration'}
        aria-labelledby={label ? labelId : undefined}
        className={cn(
          'inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 px-2 py-1.5',
          disabled && 'opacity-50',
        )}
      >
        {sortedUnits.map((unit, index) => {
          const text = PAD.format(values[index])
          return (
            <span key={unit} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="mx-0.5 text-foreground/40">
                  :
                </span>
              )}
              <div
                ref={(el) => {
                  segmentRefs.current[index] = el
                }}
                role="spinbutton"
                tabIndex={disabled ? -1 : 0}
                aria-label={UNIT_LABEL[unit]}
                aria-disabled={disabled || undefined}
                aria-valuemin={0}
                aria-valuemax={segmentMax(index, sortedUnits, max)}
                aria-valuenow={values[index]}
                aria-valuetext={pluralize(values[index], unit)}
                onBlur={() => handleBlur(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPointerDown={(event) => handlePointerDown(event, index)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ fontSize: 18, touchAction: 'none' }}
                className={cn(
                  'relative flex items-center justify-center rounded-md px-1 py-0.5 font-medium text-foreground tabular-nums outline-none select-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  scrub && !disabled && 'cursor-ew-resize',
                  disabled && 'pointer-events-none',
                  draggingIndex === index && 'bg-foreground/10',
                )}
              >
                {text.split('').map((char, i) => (
                  <AnimatedDigit key={i} char={char} reduced={reduced} />
                ))}
              </div>
            </span>
          )
        })}
      </div>
    </div>
  )
}
