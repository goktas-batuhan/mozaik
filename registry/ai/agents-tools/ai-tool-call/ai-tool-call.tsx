// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/ai-tool-call/index.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type AIToolCallStatus = 'pending' | 'running' | 'success' | 'error'

export interface AIToolCallProps {
  /** Tool name, such as `search_web`. */
  name: string
  /** Where the call is in its life. */
  status?: AIToolCallStatus
  /** What the tool was called with. Shown when the row is open. */
  args?: ReactNode
  /** What the tool returned. Shown when the row is open. */
  result?: ReactNode
  /** Short note on the right, such as "3 files" or "1.2s". */
  summary?: string
  /** Start open. */
  defaultOpen?: boolean
  className?: string
}

const WORD: Record<AIToolCallStatus, string> = { pending: 'Queued', running: 'Running', success: 'Done', error: 'Failed' }

function Badge({ status, reduced }: { status: AIToolCallStatus; reduced: boolean }) {
  const running = status === 'running'
  const tone = status === 'success' ? 'text-primary' : status === 'error' ? 'text-destructive' : 'text-muted-foreground'
  return (
    <span aria-hidden className={cn('flex size-5 shrink-0 items-center justify-center', tone)}>
      <svg viewBox="0 0 24 24" className="size-5 overflow-visible">
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: 'center' }}
          animate={running && !reduced ? { rotate: 360 } : { rotate: 0 }}
          transition={running && !reduced ? { duration: 0.9, ease: 'linear', repeat: Infinity } : { duration: 0 }}
        >
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={running ? '0.68 0.32' : '1 0'}
            strokeOpacity={status === 'pending' ? 0.5 : 1}
          />
        </motion.g>
        {status === 'success' ? <path d="M8.5 12.2 11 14.8l4.8-5.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /> : null}
        {status === 'error' ? <path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /> : null}
      </svg>
    </span>
  )
}

/** One tool call from an agent, collapsed to a single line until you ask for the details. */
export function AIToolCall({ name, status = 'pending', args, result, summary, defaultOpen = false, className }: AIToolCallProps) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const hasDetail = Boolean(args || result)
  const shown = open && hasDetail

  return (
    <div data-slot="ai-tool-call" data-status={status} className={cn('w-full overflow-hidden rounded-xl border border-border bg-background', className)}>
      <button
        type="button"
        disabled={!hasDetail}
        aria-expanded={hasDetail ? shown : undefined}
        aria-controls={hasDetail ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full cursor-pointer items-center gap-2.5 px-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:cursor-default"
      >
        <Badge status={status} reduced={reduced} />
        <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-foreground">{name}</span>
        {summary ? <span className="shrink-0 text-xs text-muted-foreground">{summary}</span> : null}
        <span className="sr-only">{WORD[status]}</span>
        {hasDetail ? (
          <svg aria-hidden viewBox="0 0 24 24" className={cn('size-4 shrink-0 text-muted-foreground', !reduced && 'transition-transform duration-200', shown && 'rotate-90')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        ) : null}
      </button>
      <AnimatePresence initial={false}>
        {shown ? (
          <motion.div
            id={panelId}
            key="detail"
            className="overflow-hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex flex-col gap-2 border-t border-border px-3 py-2.5 text-xs">
              {args ? (
                <div>
                  <p className="mb-1 text-[10px] tracking-wide text-muted-foreground uppercase">Arguments</p>
                  <div className="overflow-x-auto font-mono text-foreground">{args}</div>
                </div>
              ) : null}
              {result ? (
                <div>
                  <p className="mb-1 text-[10px] tracking-wide text-muted-foreground uppercase">Result</p>
                  <div className="overflow-x-auto text-foreground">{result}</div>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
