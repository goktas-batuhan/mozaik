// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/ai-suggestions/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AISuggestion {
  id: string
  label: string
}

export interface AISuggestionsProps {
  /** The chips to show. */
  suggestions: AISuggestion[]
  /** Called with the chip the user picked. */
  onSelect?: (suggestion: AISuggestion) => void
  /** Small heading above the chips, such as "Follow-ups". */
  label?: string
  /** Seconds between chips as they pop in, counted from the middle outward. */
  delay?: number
  /** Disables every chip. */
  disabled?: boolean
  className?: string
}

/** Prompt suggestion chips for an empty chat or the follow-ups after an answer. */
export function AISuggestions({ suggestions, onSelect, label, delay = 0.045, disabled = false, className }: AISuggestionsProps) {
  const reduced = usePrefersReducedMotion()
  const middle = (suggestions.length - 1) / 2

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p> : null}
      <ul className="flex list-none flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <motion.li
            key={s.id}
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', bounce: 0.1, duration: 0.3, delay: Math.abs(i - middle) * delay }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect?.(s)}
              className={cn(
                'inline-flex h-8 cursor-pointer items-center rounded-full border border-border bg-background px-3 text-sm text-foreground hover:bg-muted',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50',
                !reduced && 'transition-colors duration-150',
              )}
            >
              {s.label}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
