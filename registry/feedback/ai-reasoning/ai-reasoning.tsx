// Source: educlopez/smoothui (MIT)
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const SPRING = { type: 'spring', bounce: 0.1, duration: 0.25 } as const
const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** A beat before auto-collapsing, so the trace is not yanked away mid-read. */
const AUTO_COLLAPSE_MS = 600
const SHIMMER_SECONDS = 1.8

export interface AIReasoningProps {
  /** The reasoning trace. */
  children: ReactNode
  /** Collapse itself once `isStreaming` goes false, unless the reader has toggled it by hand. */
  collapseWhenDone?: boolean
  /** Start expanded. Defaults to the value of `isStreaming`. */
  defaultOpen?: boolean
  /** Seconds the model spent. Omit to have the component time the stream itself. */
  duration?: number
  /** True while the model is still reasoning. Drives the shimmer and the summary. */
  isStreaming?: boolean
  className?: string
}

/** A collapsible reasoning trace. The summary shimmers only while the model is working. */
export function AIReasoning({
  children,
  collapseWhenDone = true,
  defaultOpen,
  duration,
  isStreaming = false,
  className,
}: AIReasoningProps) {
  const reduced = usePrefersReducedMotion()
  const [isOpen, setIsOpen] = useState(defaultOpen ?? isStreaming)
  // Once the reader opens or closes it by hand, stop deciding for them.
  const [byHand, setByHand] = useState(false)
  const startedAt = useRef<number | null>(null)
  const [measured, setMeasured] = useState<number | null>(null)
  const [justFinished, setJustFinished] = useState(false)

  useEffect(() => {
    if (isStreaming) {
      startedAt.current = Date.now()
      setMeasured(null)
      setJustFinished(false)
      if (!byHand) setIsOpen(true)
    } else if (startedAt.current !== null) {
      setMeasured((Date.now() - startedAt.current) / 1000)
      startedAt.current = null
      setJustFinished(true)
    }
  }, [isStreaming, byHand])

  // Only a stream that actually ended collapses; a trace that mounted finished stays as asked.
  useEffect(() => {
    if (isStreaming || !justFinished || !collapseWhenDone || byHand) return
    const id = window.setTimeout(() => setIsOpen(false), AUTO_COLLAPSE_MS)
    return () => window.clearTimeout(id)
  }, [collapseWhenDone, isStreaming, justFinished, byHand])

  const seconds = duration ?? measured
  const summary = isStreaming ? 'Thinking' : seconds !== null ? `Thought for ${seconds.toFixed(1)}s` : 'Reasoning'

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setByHand(true)
          setIsOpen((open) => !open)
        }}
        className="group flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 text-left text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={reduced ? { duration: 0 } : SPRING}
          className="flex size-4 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.span>
        {/* The shimmer is the "still working" signal, so it exists only while streaming. */}
        {isStreaming && !reduced ? (
          <span
            className="bg-[length:200%_100%] bg-clip-text text-transparent"
            style={{
              animation: `ai-reasoning-shimmer ${SHIMMER_SECONDS}s linear infinite`,
              backgroundImage:
                'linear-gradient(90deg, currentColor 0%, currentColor 35%, color-mix(in oklab, currentColor 25%, transparent) 50%, currentColor 65%, currentColor 100%)',
            }}
          >
            {summary}
          </span>
        ) : (
          <span>{summary}</span>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {summary}
      </span>

      <style>{`@keyframes ai-reasoning-shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }`}</style>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="overflow-hidden"
            initial={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { height: SPRING, opacity: { duration: 0.18, ease: EASE_OUT } }}
          >
            {/* The rule doubles as a margin: the trace reads as an aside, not as part of the answer. */}
            <div className="ml-[7px] mt-1 border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
