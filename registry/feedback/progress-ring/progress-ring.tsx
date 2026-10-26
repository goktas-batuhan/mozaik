// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/others/progress-ring-card.tsx
import { animate, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ProgressRingProps {
  /** Progress from 0 to 100. */
  value: number
  /** Outer diameter in pixels. */
  size?: number
  /** Stroke width in pixels. */
  strokeWidth?: number
  /** Accessible name of the progress bar. */
  label?: string
  /** Shows the percentage in the middle when no children are given. */
  showValue?: boolean
  /** Seconds the ring takes to catch up with a new value. */
  duration?: number
  /** Replaces the percentage in the middle. */
  children?: ReactNode
  className?: string
}

/** A determinate ring that eases to its value and counts up in the middle. */
export function ProgressRing({
  value,
  size = 112,
  strokeWidth = 8,
  label = 'Progress',
  showValue = true,
  duration = 0.9,
  children,
  className,
}: ProgressRingProps) {
  const reduced = usePrefersReducedMotion()
  const target = Math.min(100, Math.max(0, value))
  const [shown, setShown] = useState(reduced ? target : 0)
  const from = useRef(shown)

  useEffect(() => {
    if (reduced) {
      from.current = target
      setShown(target)
      return
    }
    const controls = animate(from.current, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        from.current = v
        setShown(v)
      },
    })
    return () => controls.stop()
  }, [target, duration, reduced])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(target)}
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg aria-hidden width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / 100)}
          className="stroke-primary"
        />
      </svg>
      {children ?? (showValue ? (
        <span aria-hidden className="absolute text-xl font-semibold tabular-nums text-foreground">
          {Math.round(shown)}%
        </span>
      ) : null)}
    </div>
  )
}
