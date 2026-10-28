// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface StepProgressProps {
  /** Step names, in order. */
  steps: readonly string[]
  /** Zero-based index of the current step. Pass steps.length when everything is done. */
  current: number
  /** How far through the current step you are, 0 to 1. */
  partial?: number
  /** Accessible name of the progress bar. */
  label?: string
  className?: string
}

/** One bar cut into segments, one per step, with labels under it. Filled segments are done, the current one fills with `partial`. */
export function StepProgress({ steps, current, partial = 0, label = 'Progress', className }: StepProgressProps) {
  const reduced = usePrefersReducedMotion()
  const total = steps.length
  const at = Math.min(total, Math.max(0, Math.round(current)))
  const part = Math.min(1, Math.max(0, partial))
  const name = at >= total ? 'Complete' : steps[at]
  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={at}
        aria-valuetext={at >= total ? `All ${total} steps complete` : `Step ${at + 1} of ${total}: ${name}`}
        className="flex gap-1.5"
      >
        {steps.map((step, i) => {
          const fill = i < at ? 1 : i === at ? part : 0
          return (
            <span key={step} data-segment={i < at ? 'done' : i === at ? 'current' : 'todo'} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.span
                className="block h-full origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: fill }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 30 }}
              />
            </span>
          )
        })}
      </div>
      <ol className="mt-2 flex gap-1.5 text-xs">
        {steps.map((step, i) => (
          <li
            key={step}
            aria-current={i === at ? 'step' : undefined}
            className={cn('min-w-0 flex-1 truncate', i < at ? 'text-foreground' : i === at ? 'font-medium text-primary' : 'text-muted-foreground')}
          >
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}
