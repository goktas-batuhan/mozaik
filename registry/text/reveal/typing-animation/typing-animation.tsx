// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/typing-animation.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface TypingAnimationProps {
  /** A single string to type. Ignored when `words` is set. */
  children?: string
  /** Several strings to type one after another. */
  words?: string[]
  /** Seconds per typed character. */
  duration?: number
  /** Seconds per deleted character. Defaults to half of `duration`. */
  deleteSpeed?: number
  /** Seconds before typing starts. */
  delay?: number
  /** Seconds to hold a finished word before deleting it. */
  pause?: number
  /** Keep cycling after the last word. */
  loop?: boolean
  /** Element to render. */
  as?: ElementType
  /** Wait until the text scrolls into view. */
  startOnView?: boolean
  /** Show the cursor while typing. */
  showCursor?: boolean
  /** Shape of the cursor. */
  cursorStyle?: 'line' | 'block' | 'underscore'
  /** Shows the finished text with no typing. */
  disabled?: boolean
  className?: string
}

const CURSORS = { line: '|', block: '▌', underscore: '_' } as const

type Step = { word: number; count: number; phase: 'typing' | 'deleting' }

/**
 * Types text out character by character, optionally deleting and moving on to
 * the next word. Screen readers get the full text up front.
 */
export function TypingAnimation({
  children,
  words,
  duration = 0.08,
  deleteSpeed,
  delay = 0,
  pause = 1,
  loop = false,
  as: Tag = 'span',
  startOnView = true,
  showCursor = true,
  cursorStyle = 'line',
  disabled = false,
  className,
}: TypingAnimationProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { amount: 0.3, once: true })
  const list = useMemo(() => words ?? (children ? [children] : []), [words, children])
  const key = list.join('\u0000')
  const still = disabled || !!reduced
  const started = !startOnView || inView
  const erase = deleteSpeed ?? duration / 2

  const [ready, setReady] = useState(false)
  const [step, setStep] = useState<Step>({ word: 0, count: 0, phase: 'typing' })

  // Restart whenever the text changes.
  useEffect(() => {
    setStep({ word: 0, count: 0, phase: 'typing' })
  }, [key])

  useEffect(() => {
    if (still || !started) return
    const id = setTimeout(() => setReady(true), delay * 1000)
    return () => clearTimeout(id)
  }, [still, started, delay])

  const chars = useMemo(() => Array.from(list[step.word] ?? ''), [list, step.word])
  const last = list.length - 1
  const finished = !loop && step.word === last && step.phase === 'typing' && step.count >= chars.length

  useEffect(() => {
    if (still || !ready || list.length === 0 || finished) return
    let wait: number
    let next: Step
    if (step.phase === 'typing') {
      if (step.count < chars.length) {
        wait = duration
        next = { ...step, count: step.count + 1 }
      } else {
        wait = pause
        next = { ...step, phase: 'deleting' }
      }
    } else if (step.count > 0) {
      wait = erase
      next = { ...step, count: step.count - 1 }
    } else {
      wait = 0.15
      next = { word: (step.word + 1) % list.length, count: 0, phase: 'typing' }
    }
    const id = setTimeout(() => setStep(next), wait * 1000)
    return () => clearTimeout(id)
  }, [still, ready, list, step, chars.length, finished, duration, pause, erase])

  const shown = still
    ? (list[loop ? 0 : last] ?? '')
    : chars.slice(0, step.count).join('')
  const cursorVisible = showCursor && !still && !finished

  return (
    <Tag ref={ref} className={cn(Tag === 'span' && 'inline-block', className)}>
      <span className="sr-only">{list.join(', ')}</span>
      <span aria-hidden>
        {shown}
        {cursorVisible && (
          <motion.span
            className="inline-block"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          >
            {CURSORS[cursorStyle]}
          </motion.span>
        )}
      </span>
    </Tag>
  )
}
