import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export type TxStepStatus = 'pending' | 'active' | 'done' | 'error'

export interface TxStep {
  label: string
  description?: string
  status: TxStepStatus
}

export interface TxStepsProps {
  /** The steps in order, each with its own status. */
  steps: TxStep[]
  /** Stack the steps or lay them out in a row. */
  orientation?: 'vertical' | 'horizontal'
  /** Accessible name for the list. */
  label?: string
  className?: string
}

const STATUS_TEXT: Record<TxStepStatus, string> = {
  pending: 'pending',
  active: 'in progress',
  done: 'completed',
  error: 'failed',
}

function Indicator({ status, index, reduced }: { status: TxStepStatus; index: number; reduced: boolean }) {
  return (
    <span
      aria-hidden
      data-status={status}
      className={cn(
        'relative grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-300',
        status === 'pending' && 'border-border bg-background text-muted-foreground',
        status === 'active' && 'border-primary/30 bg-primary/10 text-primary',
        status === 'done' && 'border-primary bg-primary text-primary-foreground',
        status === 'error' && 'border-destructive bg-destructive text-primary-foreground',
      )}
    >
      {status === 'active' && !reduced && (
        <motion.span
          className="absolute -inset-px rounded-full border border-primary"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {status === 'active' && (
        <motion.svg
          viewBox="0 0 28 28"
          className="absolute -inset-px size-[calc(100%+2px)]"
          fill="none"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? undefined : { duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="14" cy="14" r="13.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="20 64" />
        </motion.svg>
      )}
      {status === 'done' ? (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      ) : status === 'error' ? (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" />
        </svg>
      ) : status === 'active' ? (
        <span className="size-1.5 rounded-full bg-primary" />
      ) : (
        index + 1
      )}
    </span>
  )
}

function Connector({ filled, horizontal, reduced }: { filled: boolean; horizontal: boolean; reduced: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'overflow-hidden rounded-full bg-border',
        horizontal ? 'mr-2 h-0.5 min-w-4 flex-1' : 'absolute top-9 bottom-1 left-[13px] w-0.5',
      )}
    >
      <motion.span
        className={cn('block size-full bg-primary', horizontal ? 'origin-left' : 'origin-top')}
        initial={false}
        animate={horizontal ? { scaleX: filled ? 1 : 0 } : { scaleY: filled ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  )
}

/** Transaction progress: Approve, Sign, Broadcast, Confirmed, or any steps you pass. */
export function TxSteps({ steps, orientation = 'vertical', label = 'Transaction progress', className }: TxStepsProps) {
  const reduced = usePrefersReducedMotion() ?? false
  const horizontal = orientation === 'horizontal'

  return (
    <ol
      aria-label={label}
      data-orientation={orientation}
      className={cn(horizontal ? 'flex w-full items-start' : 'flex flex-col', className)}
    >
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        const current = step.status === 'active' || step.status === 'error'
        const text = (
          <div className={cn('min-w-0', horizontal ? 'pr-4' : 'pt-1')}>
            <p
              className={cn(
                'text-sm leading-5 font-medium transition-colors',
                step.status === 'pending' && 'text-muted-foreground',
                step.status === 'error' && 'text-destructive',
              )}
            >
              {step.label}
              <span className="sr-only">, {STATUS_TEXT[step.status]}</span>
            </p>
            {step.description && <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.description}</p>}
          </div>
        )

        return (
          <li
            key={`${i}-${step.label}`}
            aria-current={current ? 'step' : undefined}
            className={cn(horizontal ? (last ? 'flex shrink-0 flex-col gap-2.5' : 'flex flex-1 flex-col gap-2.5') : 'relative flex gap-3', !horizontal && !last && 'pb-7')}
          >
            {horizontal ? (
              <>
                <div className="flex items-center gap-2">
                  <Indicator status={step.status} index={i} reduced={reduced} />
                  {!last && <Connector filled={step.status === 'done'} horizontal reduced={reduced} />}
                </div>
                {text}
              </>
            ) : (
              <>
                {!last && <Connector filled={step.status === 'done'} horizontal={false} reduced={reduced} />}
                <Indicator status={step.status} index={i} reduced={reduced} />
                {text}
              </>
            )}
          </li>
        )
      })}
    </ol>
  )
}
