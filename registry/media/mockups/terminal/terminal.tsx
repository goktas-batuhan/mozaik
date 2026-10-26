// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/terminal.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


interface StepContextValue {
  started: boolean
  still: boolean
  active: number
  complete: (index: number) => void
}

const StepContext = createContext<StepContextValue>({ started: true, still: false, active: Infinity, complete: () => {} })
const IndexContext = createContext(0)

/** Tells a line when it may start, and reports back when it is done. */
function useStep(delay: number) {
  const { started, still, active, complete } = useContext(StepContext)
  const index = useContext(IndexContext)
  const [go, setGo] = useState(false)
  const ready = started && active >= index

  useEffect(() => {
    if (still || !ready || go) return
    const id = setTimeout(() => setGo(true), delay * 1000)
    return () => clearTimeout(id)
  }, [still, ready, go, delay])

  const finish = useCallback(() => complete(index), [complete, index])
  return { go: still || go, finish, still }
}

export interface TerminalProps {
  /** TerminalLine and TerminalTyping elements, in the order they should appear. */
  children: ReactNode
  /** Text in the title bar. */
  title?: string
  /** Play the lines one after another. When off, each line runs on its own delay. */
  sequence?: boolean
  /** Wait until the terminal scrolls into view. */
  startOnView?: boolean
  /** Shows every line in full with no animation. */
  disabled?: boolean
  className?: string
}

/** A terminal window that plays its lines one after another. */
export function Terminal({
  children,
  title,
  sequence = true,
  startOnView = true,
  disabled = false,
  className,
}: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { amount: 0.3, once: true })
  const [active, setActive] = useState(0)

  const complete = useCallback((index: number) => setActive((a) => (a === index ? a + 1 : a)), [])
  const value = useMemo<StepContextValue>(
    () => ({
      started: disabled || !!reduced || !startOnView || inView,
      still: disabled || !!reduced,
      active: sequence && !disabled && !reduced ? active : Infinity,
      complete,
    }),
    [disabled, reduced, startOnView, inView, sequence, active, complete],
  )

  return (
    <StepContext.Provider value={value}>
      <div
        ref={ref}
        className={cn(
          'flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
          className,
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span aria-hidden className="size-2.5 rounded-full bg-destructive/80" />
          <span aria-hidden className="size-2.5 rounded-full bg-primary/80" />
          <span aria-hidden className="size-2.5 rounded-full bg-success/80" />
          {title && <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>}
        </div>
        <div className="grid min-h-0 flex-1 gap-y-1 overflow-auto p-4 font-mono text-sm">
          {Children.toArray(children).map((child, i) => (
            <IndexContext.Provider key={i} value={i}>
              {child}
            </IndexContext.Provider>
          ))}
        </div>
      </div>
    </StepContext.Provider>
  )
}

export interface TerminalLineProps {
  /** Anything: a prompt, a status line, a styled result. */
  children: ReactNode
  /** Seconds to wait after the previous line before this one appears. */
  delay?: number
  className?: string
}

/** A line that fades in. */
export function TerminalLine({ children, delay = 0, className }: TerminalLineProps) {
  const { go, finish, still } = useStep(delay)

  if (still) return <div className={className}>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={go ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => go && finish()}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export interface TerminalTypingProps {
  /** The text to type. */
  children: string
  /** Seconds per character. */
  duration?: number
  /** Seconds to wait after the previous line before typing starts. */
  delay?: number
  className?: string
}

/** A line that types itself out. Screen readers get the full text up front. */
export function TerminalTyping({ children, duration = 0.04, delay = 0, className }: TerminalTypingProps) {
  const { go, finish, still } = useStep(delay)
  const [count, setCount] = useState(0)
  const chars = useMemo(() => Array.from(children), [children])
  const finishRef = useRef(finish)

  useEffect(() => {
    finishRef.current = finish
  }, [finish])

  useEffect(() => {
    if (still || !go) return
    if (count >= chars.length) {
      finishRef.current()
      return
    }
    const id = setTimeout(() => setCount((c) => c + 1), duration * 1000)
    return () => clearTimeout(id)
  }, [still, go, count, chars.length, duration])

  return (
    <div className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>{still ? children : chars.slice(0, count).join('')}</span>
    </div>
  )
}
