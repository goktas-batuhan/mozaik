// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/word-rotate.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface WordRotateProps {
  /** Words to cycle through, in order. */
  words: string[]
  /** Seconds each word stays on screen. */
  interval?: number
  /** Seconds each swap takes. */
  duration?: number
  /** Seconds before the first swap is counted. */
  delay?: number
  /** Element to render. */
  as?: ElementType
  /** Shows the first word only. */
  disabled?: boolean
  className?: string
}

/**
 * Swaps one word for the next with a short slide and fade. Assistive tech
 * reads the whole list once; the visible swap is hidden from it.
 */
export function WordRotate({
  words,
  interval = 2.5,
  duration = 0.3,
  delay = 0,
  as: Tag = 'span',
  disabled = false,
  className,
}: WordRotateProps) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const still = disabled || !!reduced || words.length < 2

  useEffect(() => {
    if (still) return
    let id: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(
      () => {
        id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval * 1000)
      },
      delay * 1000,
    )
    return () => {
      clearTimeout(start)
      if (id !== undefined) clearInterval(id)
    }
  }, [still, interval, delay, words.length])

  if (still) {
    return <Tag className={cn('inline-block', className)}>{words[0]}</Tag>
  }

  return (
    <Tag className={cn('inline-block overflow-hidden py-[0.1em] align-bottom', className)}>
      <span className="sr-only">{words.join(', ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-hidden
          className="block"
          initial={{ opacity: 0, y: '-60%' }}
          animate={{ opacity: 1, y: '0%' }}
          exit={{ opacity: 0, y: '60%' }}
          transition={{ duration, ease: 'easeOut' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </Tag>
  )
}
