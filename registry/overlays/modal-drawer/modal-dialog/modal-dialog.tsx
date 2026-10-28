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

export interface ModalDialogProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Heading of the dialog. Also its accessible name. */
  title: ReactNode
  /** Short explanation under the title. */
  description?: ReactNode
  /** Buttons row at the bottom. */
  footer?: ReactNode
  /** Width of the panel. */
  size?: 'sm' | 'md' | 'lg'
  /** Use `alertdialog` for a confirmation that needs an answer. It then ignores clicks on the backdrop. */
  role?: 'dialog' | 'alertdialog'
  /** Close when the backdrop is clicked. */
  closeOnBackdrop?: boolean
}

const SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl' } as const

/**
 * A centered modal dialog. Focus moves in and stays inside, Escape closes it and focus returns to
 * where it came from. Mark an element with `data-autofocus` to choose where focus lands.
 */
export function ModalDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  size = 'md',
  role = 'dialog',
  closeOnBackdrop = true,
  className,
  children,
  ...props
}: ModalDialogProps) {
  const reduced = usePrefersReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useModalBehavior(open, panel, () => onOpenChange(false))
  const t = reduced ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            aria-hidden
            data-slot="backdrop"
            className="absolute inset-0 bg-background/70 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t}
            onClick={role === 'dialog' && closeOnBackdrop ? () => onOpenChange(false) : undefined}
          />
          <motion.div
            ref={panel}
            {...(props as object)}
            role={role}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4 }}
            transition={t}
            className={cn(
              'relative flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl outline-none',
              SIZE[size],
              className,
            )}
          >
            <div className="flex flex-col gap-1.5">
              <h2 id={titleId} className="text-lg leading-6 font-semibold">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            {children}
            {footer ? <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
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
