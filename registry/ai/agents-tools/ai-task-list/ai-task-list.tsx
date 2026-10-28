// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/ai-task-list/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type AITaskStatus = 'pending' | 'running' | 'done' | 'failed'

export interface AITask {
  id: string
  label: string
  status: AITaskStatus
  /** Short note on the right, such as "12/12" or "3 files". */
  note?: string
  /** Sub-steps, one level deep. */
  children?: AITask[]
}

export interface AITaskListProps {
  /** The plan, in order. */
  tasks: AITask[]
  /** Heading. The done/total count is worked out from the tasks. */
  label?: string
  className?: string
}

const flatten = (tasks: AITask[]): AITask[] => tasks.flatMap((t) => [t, ...flatten(t.children ?? [])])

const STATUS_WORD: Record<AITaskStatus, string> = { pending: 'Pending', running: 'Running', done: 'Done', failed: 'Failed' }

function Box({ status, reduced }: { status: AITaskStatus; reduced: boolean }) {
  const done = status === 'done'
  const failed = status === 'failed'
  const tone = failed ? 'text-destructive' : done ? 'text-primary' : 'text-muted-foreground'
  return (
    <span aria-hidden className={cn('flex size-4 shrink-0 items-center justify-center', tone)}>
      <svg viewBox="0 0 14 14" className="size-4">
        <rect x="1" y="1" width="12" height="12" rx="3.5" fill="currentColor" fillOpacity={done || failed ? 0.12 : 0} stroke="currentColor" strokeWidth="1.4" />
        {done ? (
          <motion.path
            d="M3.5 7.5 6 10l4.5-5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
          />
        ) : null}
        {failed ? <path d="M5 5l4 4M9 5l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : null}
        {status === 'running' ? <circle cx="7" cy="7" r="2" fill="currentColor" /> : null}
      </svg>
    </span>
  )
}

function Row({ task, depth, reduced }: { task: AITask; depth: number; reduced: boolean }) {
  return (
    <li data-status={task.status} className="list-none" style={{ paddingLeft: depth * 20 }}>
      <span className="relative flex h-7 items-center gap-2">
        <Box status={task.status} reduced={reduced} />
        <span className={cn('min-w-0 flex-1 truncate text-sm', task.status === 'done' ? 'text-muted-foreground' : 'text-foreground')}>
          {task.label}
          <span className="sr-only"> ({STATUS_WORD[task.status]})</span>
        </span>
        {task.note ? <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{task.note}</span> : null}
        {task.status === 'running' && !reduced ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
            style={{ backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }}
            animate={{ backgroundPositionX: ['-100%', '200%'] }}
            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
          />
        ) : null}
      </span>
    </li>
  )
}

/** The plan an agent is working through, with a done/total count worked out from the rows. */
export function AITaskList({ tasks, label = 'Plan', className }: AITaskListProps) {
  const reduced = usePrefersReducedMotion()
  const all = flatten(tasks)
  const done = all.filter((t) => t.status === 'done').length

  return (
    <div data-slot="ai-task-list" className={cn('w-full rounded-xl border border-border bg-background p-3', className)}>
      <div className="mb-1 flex h-6 items-center justify-between">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          <span className="sr-only">Done </span>
          {done}/{all.length}
        </p>
      </div>
      <ul className="m-0 list-none p-0">
        {tasks.map((task) => (
          <Fragment key={task.id}>
            <Row task={task} depth={0} reduced={reduced} />
            {task.children?.map((child) => <Row key={child.id} task={child} depth={1} reduced={reduced} />)}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
