// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/faq-section/faq-journey.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FaqItem {
  /** Unique id of the question. */
  id: string
  /** The question. */
  question: ReactNode
  /** The answer. */
  answer: ReactNode
}

export interface FaqJourneyProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Questions in reading order. Each gets a numbered step on the line. */
  items: FaqItem[]
  /** Id of the step that is open first. */
  defaultOpen?: string
  /** Seconds the open and close take. */
  duration?: number
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** FAQ as a numbered path: a vertical line with one step per question, one answer open at a time. */
export function FaqJourney({
  title = 'How it works',
  description,
  items,
  defaultOpen,
  duration = 0.3,
  as: Tag = 'section',
  className,
}: FaqJourneyProps) {
  const uid = useId()
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null)

  return (
    <Tag aria-labelledby={`${uid}-title`} className={cn('@container mx-auto w-full max-w-3xl', className)}>
      <div className="mb-10 text-center">
        <h2 id={`${uid}-title`} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      <ol className="relative">
        <span aria-hidden className="absolute top-4 bottom-4 left-5 w-px bg-border" />
        {items.map((item, i) => {
          const isOpen = open === item.id
          return (
            <li key={item.id} className="relative flex gap-4 pb-4 last:pb-0 @sm:gap-6">
              <span
                aria-hidden
                className={cn(
                  'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-colors duration-300 motion-reduce:transition-none',
                  isOpen ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card">
                <h3>
                  <button
                    type="button"
                    id={`${uid}-h-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-p-${item.id}`}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-3.5 text-left text-sm font-medium text-card-foreground outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.question}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none', isOpen && 'rotate-180')}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`${uid}-p-${item.id}`}
                      role="region"
                      aria-labelledby={`${uid}-h-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={reduced ? { duration: 0 } : { duration, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>
    </Tag>
  )
}
