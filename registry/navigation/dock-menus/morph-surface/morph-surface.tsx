// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/morph-surface.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig, type Transition } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface MorphSurfaceProps {
  /** Width of the collapsed pill in pixels, or `auto` to fit its content. */
  collapsedWidth?: number | 'auto'
  /** Height of the collapsed pill in pixels. */
  collapsedHeight?: number
  /** Width of the open surface in pixels. */
  expandedWidth?: number
  /** Height of the open surface in pixels. */
  expandedHeight?: number
  /** Text shown in the pill's trigger and above the field when open. */
  triggerLabel?: string
  /** Icon shown before the trigger label. */
  triggerIcon?: ReactNode
  /** Name shown beside the dot in the collapsed pill. */
  title?: string
  /** Placeholder of the message field. */
  placeholder?: string
  /** Called with the form data on submit. The surface closes and shows a check once it resolves. */
  onSubmit?: (data: FormData) => void | Promise<void>
  /** Called when the surface opens. */
  onOpen?: () => void
  /** Called when the surface closes without sending. */
  onClose?: () => void
  /** Called after a successful submit. */
  onSuccess?: () => void
  /** Controlled open state. Leave it out to let the surface manage itself. */
  isOpen?: boolean
  /** Called with the next open state when it is controlled. */
  onOpenChange?: (open: boolean) => void
  className?: string
}

const DEFAULT_WIDTH = 360
const DEFAULT_HEIGHT = 200

function IconCheck() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Kbd({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-sans text-xs text-muted-foreground',
        className,
      )}
    >
      {children}
    </kbd>
  )
}

/** Runs `handler` when a press that began outside `ref` ends outside it, while `active`. */
function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, active: boolean) {
  const latest = useRef(handler)
  latest.current = handler
  useEffect(() => {
    if (!active) return
    let startedOutside = false
    const outside = (event: Event) => !!ref.current && !ref.current.contains(event.target as Node | null)
    const start = (event: PointerEvent) => {
      startedOutside = outside(event)
    }
    const end = (event: Event) => {
      if (startedOutside && outside(event)) latest.current()
      startedOutside = false
    }
    document.addEventListener('pointerdown', start)
    document.addEventListener('click', end)
    document.addEventListener('touchend', end)
    return () => {
      document.removeEventListener('pointerdown', start)
      document.removeEventListener('click', end)
      document.removeEventListener('touchend', end)
    }
  }, [ref, active])
}

/** A small pill that morphs into a feedback form, and back, with a check when it is sent. */
export function MorphSurface({
  collapsedWidth = DEFAULT_WIDTH,
  collapsedHeight = 44,
  expandedWidth = DEFAULT_WIDTH,
  expandedHeight = DEFAULT_HEIGHT,
  triggerLabel = 'Feedback',
  triggerIcon,
  title = 'Morph Surface',
  placeholder = "What's on your mind?",
  onSubmit,
  onOpen,
  onClose,
  onSuccess,
  isOpen: controlled,
  onOpenChange,
  className,
}: MorphSurfaceProps) {
  const reduced = usePrefersReducedMotion()
  const dotId = `morph-surface-dot-${useId()}`
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [internal, setInternal] = useState(false)
  const [success, setSuccess] = useState(false)
  const successTimer = useRef<number | undefined>(undefined)

  const open = controlled ?? internal

  useEffect(() => () => window.clearTimeout(successTimer.current), [])

  const setOpen = (next: boolean) => {
    if (next === open) return
    if (controlled === undefined) setInternal(next)
    onOpenChange?.(next)
    if (next) onOpen?.()
    else onClose?.()
  }

  // Focus the field once it exists.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useClickOutside(containerRef, () => setOpen(false), open)

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const finish = () => {
    if (controlled === undefined) setInternal(false)
    onOpenChange?.(false)
    setSuccess(true)
    window.clearTimeout(successTimer.current)
    successTimer.current = window.setTimeout(() => setSuccess(false), 1500)
    onSuccess?.()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      await onSubmit?.(data)
      finish()
    } catch (error) {
      console.error('MorphSurface submit failed:', error)
    }
  }

  const onFieldKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  const surface: Transition = reduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 550, damping: 45, mass: 0.7, delay: open ? 0 : 0.08 }
  const dot: Transition = reduced ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 35 }
  const check: Transition = reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 22, delay: 0.3 }

  return (
    <div className={cn('flex items-end justify-center', className)} style={{ width: expandedWidth, height: expandedHeight }}>
      <motion.div
        ref={containerRef}
        onClick={() => {
          if (!open) setOpen(true)
        }}
        className={cn(
          'relative bottom-8 z-10 flex flex-col items-center overflow-hidden bg-card text-card-foreground shadow-md ring-1 ring-border',
          !open && 'cursor-pointer transition-[filter] duration-200 hover:brightness-105',
        )}
        initial={false}
        animate={{
          width: open ? expandedWidth : collapsedWidth,
          height: open ? expandedHeight : collapsedHeight,
          borderRadius: open ? 14 : 20,
        }}
        transition={surface}
      >
        <footer className="mt-auto flex h-11 items-center justify-center whitespace-nowrap select-none">
          <div className="flex items-center justify-center gap-6 px-3">
            <div className="flex w-fit items-center gap-2">
              {open ? (
                <div aria-hidden="true" className="size-5 opacity-0" />
              ) : (
                <motion.div aria-hidden="true" className="size-5 rounded-full bg-primary" layoutId={dotId} transition={dot}>
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={check}
                        className="m-0.5"
                      >
                        <IconCheck />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              <div className="text-sm text-foreground">{title}</div>
            </div>
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              tabIndex={open ? -1 : 0}
              onClick={(event) => {
                event.stopPropagation()
                setOpen(!open)
              }}
              className="-m-2 flex flex-1 cursor-pointer justify-end gap-1 rounded-full p-2 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {triggerIcon ? <span className="flex items-center">{triggerIcon}</span> : null}
              <span className="ml-1 max-w-[20ch] truncate">{triggerLabel}</span>
            </button>
          </div>
        </footer>

        <form
          onSubmit={handleSubmit}
          className="absolute bottom-0"
          style={{ width: expandedWidth, height: expandedHeight, pointerEvents: open ? 'all' : 'none' }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 550, damping: 45, mass: 0.7 }}
                className="flex h-full flex-col p-1"
              >
                <div className="flex justify-between py-1">
                  <p className="z-[2] ml-[25px] flex items-center gap-1.5 text-sm text-muted-foreground select-none">
                    {triggerLabel}
                  </p>
                  <button
                    type="submit"
                    aria-label="Send"
                    className="mt-1 -translate-y-[3px] flex cursor-pointer items-center justify-center gap-1 rounded-xl pr-1 text-center text-sm text-muted-foreground select-none focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Kbd>⌘</Kbd>
                    <Kbd className="w-fit">Enter</Kbd>
                  </button>
                </div>
                <textarea
                  ref={inputRef}
                  name="message"
                  aria-label={triggerLabel}
                  placeholder={placeholder}
                  required
                  spellCheck={false}
                  onKeyDown={onFieldKeyDown}
                  className="h-full w-full resize-none scroll-py-2 rounded-t-xs rounded-b-lg bg-muted p-4 text-base caret-primary outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring/30"
                />
              </motion.div>
            )}
          </AnimatePresence>
          {open && (
            <motion.div
              aria-hidden="true"
              layoutId={dotId}
              className="absolute top-[18.5px] left-4 size-2 rounded-full bg-primary"
              transition={dot}
            />
          )}
        </form>
      </motion.div>
    </div>
  )
}
