// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AISource {
  id: string
  title: string
  url: string
  /** Short site name. Defaults to the host of the url. */
  site?: string
}

export interface AISourcesProps {
  /** The pages the answer was built from. */
  sources: AISource[]
  /** Open state when you control it. */
  open?: boolean
  /** Initial open state when you do not control it. */
  defaultOpen?: boolean
  /** Called when the reader opens or closes the list. */
  onOpenChange?: (open: boolean) => void
  className?: string
}

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** A "Used N sources" toggle that opens into a numbered list of links, for citing where an answer came from. */
export function AISources({ sources, open, defaultOpen = false, onOpenChange, className }: AISourcesProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = useState(defaultOpen)
  const panelId = useId()
  const isOpen = open ?? inner
  const count = sources.length

  const toggle = () => {
    if (open === undefined) setInner(!isOpen)
    onOpenChange?.(!isOpen)
  }

  if (count === 0) return null

  return (
    <div data-slot="ai-sources" className={cn('w-full text-sm', className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <svg aria-hidden viewBox="0 0 24 24" className={cn('size-4', !reduced && 'transition-transform duration-200', isOpen && 'rotate-90')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
        Used {count} {count === 1 ? 'source' : 'sources'}
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.ol
            id={panelId}
            key="list"
            className="m-0 flex list-none flex-col gap-1 overflow-hidden p-0 pt-1"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          >
            {sources.map((s, i) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center gap-2.5 rounded-lg border border-border bg-background px-2.5 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span aria-hidden className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{s.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{s.site ?? host(s.url)}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </motion.ol>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
