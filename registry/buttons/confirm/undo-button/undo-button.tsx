// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/undo-button.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

type Phase = 'idle' | 'pending' | 'done'

const TICK = 100

export interface UndoButtonProps {
  /** What the button does, e.g. "Archive". */
  label?: string
  /** The same action in the past tense, e.g. "Archived". */
  doneLabel?: string
  /** Leading icon in the idle state. Decorative. */
  icon?: ReactNode
  /** How long the action can be undone, in milliseconds. Hovering the button pauses the clock. */
  duration?: number
  /** After committing, return to idle after this many milliseconds. `null` stays on the done state. */
  resetAfter?: number | null
  /** Called when the button is pressed and the undo window opens. */
  onAction?: () => void
  /** Called when the window closes without an undo: do the real work here. */
  onCommit?: () => void
  /** Called when the action is undone. */
  onUndo?: () => void
  /** Extra classes for the button. */
  className?: string
}

const ArchiveIcon = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4" />
  </svg>
)
const UndoIcon = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </svg>
)
const CheckIcon = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5 9-10" />
  </svg>
)

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/** A button that acts at once, then holds the real commit back for a short undo window. Ctrl/Cmd+Z undoes too. */
export function UndoButton({
  label = 'Archive',
  doneLabel = 'Archived',
  icon = ArchiveIcon,
  duration = 5000,
  resetAfter = 2400,
  onAction,
  onCommit,
  onUndo,
  className,
}: UndoButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const hovered = useRef(false)
  const callbacks = useRef({ onCommit, onUndo })
  callbacks.current = { onCommit, onUndo }

  const undo = useCallback(() => {
    setPhase('idle')
    callbacks.current.onUndo?.()
  }, [])

  useEffect(() => {
    if (phase !== 'pending') return
    setElapsed(0)
    let spent = 0
    const timer = setInterval(() => {
      if (hovered.current) return
      spent += TICK
      setElapsed(spent)
      if (spent >= duration) {
        clearInterval(timer)
        setPhase('done')
        callbacks.current.onCommit?.()
      }
    }, TICK)
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === 'z' && !isEditable(event.target)) {
        event.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      clearInterval(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [phase, duration, undo])

  useEffect(() => {
    if (phase !== 'done' || resetAfter === null) return
    const timer = setTimeout(() => setPhase('idle'), resetAfter)
    return () => clearTimeout(timer)
  }, [phase, resetAfter])

  const seconds = Math.max(0, Math.ceil((duration - elapsed) / 1000))
  const ariaLabel =
    phase === 'pending'
      ? `${doneLabel}. Undo, ${seconds} second${seconds === 1 ? '' : 's'} left`
      : phase === 'done'
        ? doneLabel
        : label
  const swap = reduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' as const }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        data-phase={phase}
        aria-label={ariaLabel}
        aria-disabled={phase === 'done'}
        onClick={() => {
          if (phase === 'idle') {
            setPhase('pending')
            onAction?.()
          } else if (phase === 'pending') undo()
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') hovered.current = true
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') hovered.current = false
        }}
        className={cn(
          'relative inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border px-4 text-sm font-medium whitespace-nowrap select-none',
          phase === 'done' ? 'cursor-default bg-muted text-muted-foreground' : 'bg-card text-card-foreground hover:bg-muted',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={phase}
            className="inline-flex items-center gap-2"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
            transition={swap}
          >
            {phase === 'idle' ? (
              <>
                <span aria-hidden>{icon}</span>
                {label}
              </>
            ) : null}
            {phase === 'pending' ? (
              <>
                <span className="text-muted-foreground">{doneLabel}</span>
                <span aria-hidden className="h-4 w-px bg-border" />
                <span aria-hidden>{UndoIcon}</span>
                Undo
                <span aria-hidden className="min-w-[1ch] text-center text-muted-foreground tabular-nums">
                  {seconds}
                </span>
              </>
            ) : null}
            {phase === 'done' ? (
              <>
                <span aria-hidden>{CheckIcon}</span>
                {doneLabel}
              </>
            ) : null}
          </motion.span>
        </AnimatePresence>
        {phase === 'pending' ? (
          <span
            aria-hidden
            data-slot="progress"
            className={cn('absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary', !reduced && 'transition-transform duration-100 ease-linear')}
            style={{ transform: `scaleX(${Math.max(0, 1 - elapsed / duration)})` }}
          />
        ) : null}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {phase === 'pending' ? `${doneLabel}. Press the button or Control Z to undo.` : phase === 'done' ? doneLabel : ''}
      </span>
    </span>
  )
}
