// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type ReactNode, type RefObject, useEffect, useId, useRef } from 'react'
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

export type SheetDrawerSide = 'right' | 'left' | 'bottom'

export interface SheetDrawerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Heading of the drawer. Also its accessible name. */
  title: ReactNode
  description?: ReactNode
  /** Buttons row pinned to the bottom of the drawer. */
  footer?: ReactNode
  /** Edge the drawer slides in from. The bottom drawer can also be dragged down to dismiss. */
  side?: SheetDrawerSide
}

const PLACE: Record<SheetDrawerSide, string> = {
  right: 'inset-y-0 right-0 h-full w-full max-w-sm border-l',
  left: 'inset-y-0 left-0 h-full w-full max-w-sm border-r',
  bottom: 'inset-x-0 bottom-0 max-h-[85%] w-full rounded-t-2xl border-t',
}
const HIDDEN = { right: { x: '100%' }, left: { x: '-100%' }, bottom: { y: '100%' } } as const

/**
 * A panel that slides in from an edge over a dimmed page. Focus is trapped inside, Escape and the
 * backdrop close it. Mark an element with `data-autofocus` to choose where focus lands.
 */
export function SheetDrawer({ open, onOpenChange, title, description, footer, side = 'right', className, children, ...props }: SheetDrawerProps) {
  const reduced = usePrefersReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useModalBehavior(open, panel, () => onOpenChange(false))
  const t = reduced ? { duration: 0 } : { type: 'spring' as const, duration: 0.4, bounce: 0 }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            aria-hidden
            data-slot="backdrop"
            className="absolute inset-0 bg-background/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={panel}
            {...(props as object)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={HIDDEN[side]}
            animate={{ x: 0, y: 0 }}
            exit={HIDDEN[side]}
            transition={t}
            drag={side === 'bottom' && !reduced ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onOpenChange(false)
            }}
            className={cn('absolute flex flex-col gap-4 border-border bg-card p-6 text-card-foreground shadow-2xl outline-none', PLACE[side], className)}
          >
            {side === 'bottom' ? <span aria-hidden className="mx-auto -mt-2 h-1.5 w-10 shrink-0 rounded-full bg-muted" /> : null}
            <div className="flex flex-col gap-1.5 pr-8">
              <h2 id={titleId} className="text-lg leading-6 font-semibold">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
