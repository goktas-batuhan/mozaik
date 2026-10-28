// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
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

export interface FaqSplitViewProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Questions and answers. */
  items: FaqItem[]
  /** Id of the question selected first. Defaults to the first one. */
  defaultSelected?: string
  /** Seconds the answer takes to fade in. */
  duration?: number
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** Question list on one side, the selected answer in a large panel on the other. */
export function FaqSplitView({
  title = 'Pick a question',
  description,
  items,
  defaultSelected,
  duration = 0.25,
  as: Tag = 'section',
  className,
}: FaqSplitViewProps) {
  const uid = useId()
  const reduced = usePrefersReducedMotion()
  const [selected, setSelected] = useState(defaultSelected ?? items[0]?.id)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(0, items.findIndex((i) => i.id === selected))
  const current = items[index]

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1
    const to = e.key === 'ArrowDown' ? (i === last ? 0 : i + 1) : e.key === 'ArrowUp' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (to < 0) return
    e.preventDefault()
    tabs.current[to]?.focus()
    setSelected(items[to]!.id)
  }

  return (
    <Tag aria-labelledby={`${uid}-title`} className={cn('@container mx-auto w-full max-w-5xl', className)}>
      <div className="mb-10 max-w-xl">
        <h2 id={`${uid}-title`} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-4 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div role="tablist" aria-orientation="vertical" aria-label="Questions" className="flex flex-col gap-1">
          {items.map((item, i) => {
            const active = item.id === current?.id
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${item.id}`}
                aria-selected={active}
                aria-controls={`${uid}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  'rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {item.question}
              </button>
            )
          })}
        </div>
        <div
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={current ? `${uid}-tab-${current.id}` : undefined}
          className="min-h-56 rounded-2xl border border-border bg-card p-6 @xl:p-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reduced ? { duration: 0 } : { duration, ease: 'easeOut' }}
              >
                <p className="text-xl font-semibold text-balance text-card-foreground">{current.question}</p>
                <div className="mt-4 leading-relaxed text-muted-foreground">{current.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Tag>
  )
}
