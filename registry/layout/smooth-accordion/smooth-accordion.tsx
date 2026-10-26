// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/apps/ui-layout/components/ui/accordion.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface SmoothAccordionItem {
  /** Unique id of the item. */
  id: string
  /** Header text. */
  title: ReactNode
  /** Panel content. */
  content: ReactNode
}

export interface SmoothAccordionProps {
  /** The items, top to bottom. */
  items: SmoothAccordionItem[]
  /** `single` keeps one item open, `multiple` lets several stay open. */
  type?: 'single' | 'multiple'
  /** Ids of the items that are open first. */
  defaultValue?: string[]
  /** Lets the open item in `single` mode be closed again. */
  collapsible?: boolean
  /** Called with the open ids whenever they change. */
  onValueChange?: (value: string[]) => void
  /** Seconds the open and close take. */
  duration?: number
  /** Turns every header off. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

/** A stack of disclosures. Panels grow and shrink to their content and headers respond to arrow keys. */
export function SmoothAccordion({
  items,
  type = 'single',
  defaultValue = [],
  collapsible = true,
  onValueChange,
  duration = 0.3,
  disabled = false,
  className,
}: SmoothAccordionProps) {
  const uid = useId()
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState<string[]>(defaultValue)
  const headers = useRef<(HTMLButtonElement | null)[]>([])

  const toggle = (id: string) => {
    const isOpen = value.includes(id)
    let next: string[]
    if (type === 'multiple') next = isOpen ? value.filter((v) => v !== id) : [...value, id]
    else next = isOpen ? (collapsible ? [] : value) : [id]
    setValue(next)
    onValueChange?.(next)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1
    const to = e.key === 'ArrowDown' ? (i === last ? 0 : i + 1) : e.key === 'ArrowUp' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (to < 0) return
    e.preventDefault()
    headers.current[to]?.focus()
  }

  return (
    <div className={cn('w-full divide-y divide-border rounded-xl border border-border bg-card', className)}>
      {items.map((item, i) => {
        const open = value.includes(item.id)
        return (
          <div key={item.id}>
            <h3>
              <button
                ref={(el) => {
                  headers.current[i] = el
                }}
                type="button"
                id={`${uid}-h-${item.id}`}
                aria-expanded={open}
                aria-controls={`${uid}-p-${item.id}`}
                disabled={disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-card-foreground outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {item.title}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none', open && 'rotate-180')}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
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
                  <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
