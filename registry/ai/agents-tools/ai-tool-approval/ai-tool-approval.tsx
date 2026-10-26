// Source: kokonut-labs/kokonutui (MIT)
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type ToolDecision = 'pending' | 'approved' | 'denied'

export interface AIToolApprovalProps {
  /** The tool's name, such as `bash` or `write_file`. */
  tool: string
  /** What the agent wants to do, in plain words: "Run a command". */
  title: string
  /** A command or text shows as code; an object shows as labelled fields. */
  input: string | Record<string, string | number | boolean>
  /** Why the agent wants this, shown under the input. */
  reason?: string
  /** Marks the call as risky: a badge, and a destructive-styled Approve button. */
  destructive?: boolean
  /** Controls the decision from outside. Leave it out and the card keeps its own. */
  decision?: ToolDecision
  approveLabel?: string
  denyLabel?: string
  onApprove?: () => void
  onDeny?: () => void
  /** Seconds for the card to fade in and fold. */
  duration?: number
  /** Seconds before the card fades in. */
  delay?: number
  /** Disables both buttons. */
  disabled?: boolean
  /** Extra content under the reason, e.g. a diff preview. */
  children?: ReactNode
  className?: string
}

/** A card where the user approves or denies an agent's tool call. The decision is announced politely. */
export function AIToolApproval({
  tool,
  title,
  input,
  reason,
  destructive = false,
  decision,
  approveLabel = 'Approve',
  denyLabel = 'Deny',
  onApprove,
  onDeny,
  duration = 0.25,
  delay = 0,
  disabled = false,
  children,
  className,
}: AIToolApprovalProps) {
  const reduced = usePrefersReducedMotion()
  const [own, setOwn] = useState<ToolDecision>('pending')
  const state = decision ?? own
  const titleId = useId()
  const summary = typeof input === 'string' ? input : (Object.values(input)[0]?.toString() ?? '')

  const decide = (next: Exclude<ToolDecision, 'pending'>) => {
    setOwn(next)
    if (next === 'approved') onApprove?.()
    else onDeny?.()
  }

  const t = { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay }

  return (
    <motion.section
      aria-labelledby={titleId}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={t}
      className={cn('w-full max-w-md rounded-2xl border bg-card p-4 text-card-foreground shadow-sm', className)}
    >
      <header className="flex items-center gap-2">
        <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4.5 6.5 8 3 11.5M8 12h5" />
          </svg>
        </span>
        <h3 id={titleId} className="text-sm font-medium">
          {title}
        </h3>
        <code className="font-mono text-xs text-muted-foreground">{tool}</code>
        {destructive && (
          <span className="ml-auto rounded-md bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive">
            Destructive
          </span>
        )}
      </header>

      {typeof input === 'string' ? (
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-muted px-3 py-2.5 font-mono text-[13px] leading-relaxed">
          <span aria-hidden className="select-none text-muted-foreground">
            ${' '}
          </span>
          {input}
        </pre>
      ) : (
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-lg bg-muted px-3 py-2.5 text-[13px]">
          {Object.entries(input).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="min-w-0 truncate font-mono">{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}
      {reason && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{reason}</p>}
      {children}

      <AnimatePresence initial={false} mode="wait">
        {state === 'pending' ? (
          <motion.div
            key="actions"
            exit={{ opacity: 0 }}
            transition={t}
            className="mt-4 flex justify-end gap-2"
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => decide('denied')}
              className="h-8 rounded-lg border px-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {denyLabel}
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => decide('approved')}
              className={cn(
                'h-8 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50',
                destructive
                  ? 'bg-destructive text-background hover:bg-destructive/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              {approveLabel}
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="result"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t}
            className={cn('mt-4 text-sm font-medium', state === 'approved' ? 'text-[var(--success)]' : 'text-muted-foreground')}
          >
            {state === 'approved' ? 'Approved' : 'Denied'}
            <span className="font-normal text-muted-foreground"> · {summary}</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Always in the DOM so the change is announced. */}
      <p role="status" aria-live="polite" className="sr-only">
        {state === 'pending' ? '' : `${state === 'approved' ? 'Approved' : 'Denied'}: ${title}`}
      </p>
    </motion.section>
  )
}
