// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/lightbox-grid.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type ReactNode, type RefObject, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Moves focus in, traps Tab, closes on Escape, locks page scroll and gives focus back on close. */
function useModalBehavior(open: boolean, panel: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    if (!open) return
    const node = panel.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ;(node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node)?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close.current()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (items.length === 0) {
        e.preventDefault()
        node.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === node)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open, panel])
}

export interface LightboxItem {
  id: string
  /** Name of the item for screen readers. */
  label: string
  /** The tile in the grid. */
  thumb: ReactNode
  /** The large view. Defaults to the thumb. */
  content?: ReactNode
}

export interface LightboxGridProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  items: LightboxItem[]
  /** Columns of the grid. */
  columns?: 2 | 3 | 4
  /** Called with the index of the open item, or null when the viewer closes. */
  onOpenChange?: (index: number | null) => void
}

const COLS = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' } as const

/** A grid of tiles that opens into a full-screen viewer with previous/next, arrow keys, Escape and a focus trap. */
export function LightboxGrid({ items, columns = 3, onOpenChange, className, ...props }: LightboxGridProps) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState<number | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const open = index !== null
  const total = items.length

  const change = (next: number | null) => {
    setIndex(next)
    onOpenChange?.(next)
  }
  useModalBehavior(open, panel, () => change(null))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i === null ? i : (i + 1) % total))
      if (e.key === 'ArrowLeft') setIndex((i) => (i === null ? i : (i - 1 + total) % total))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, total])

  const current = index === null ? null : items[index]
  const control =
    'inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background/80 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

  return (
    <div {...props} className={cn('w-full', className)}>
      <ul className={cn('grid gap-3', COLS[columns])}>
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={`Open ${item.label}`}
              aria-haspopup="dialog"
              onClick={() => change(i)}
              className="block aspect-square w-full cursor-pointer overflow-hidden rounded-xl border border-border transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              {item.thumb}
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {current ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              aria-hidden
              data-slot="backdrop"
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
              onClick={() => change(null)}
            />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={current.label}
              tabIndex={-1}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={reduced ? { duration: 0 } : { duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex w-full max-w-xl flex-col items-center gap-4 outline-none"
            >
              <div className="aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">{current.content ?? current.thumb}</div>
              <div className="flex items-center gap-3">
                <button type="button" aria-label="Previous" onClick={() => setIndex((index! - 1 + total) % total)} className={control}>
                  <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <span aria-live="polite" className="min-w-24 text-center text-sm leading-5 text-muted-foreground">
                  {current.label} · {index! + 1}/{total}
                </span>
                <button type="button" aria-label="Next" onClick={() => setIndex((index! + 1) % total)} className={control}>
                  <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
                <button type="button" aria-label="Close" onClick={() => change(null)} className={control}>
                  <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
