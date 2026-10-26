// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/family-button.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface FamilyButtonProps {
  /** Content shown inside the expanded panel. */
  children: ReactNode
  /** Accessible name of the toggle button. */
  label?: string
  /** Whether the panel starts open. */
  defaultOpen?: boolean
  /** Controlled open state. */
  open?: boolean
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Width of the open panel in pixels. */
  width?: number
  /** Height of the open panel in pixels. */
  height?: number
  /** Seconds the expand and collapse take. */
  duration?: number
  /** Turns the button off. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

const CLOSED = 64

/** A square button that grows into a panel. Escape or the toggle collapses it again. */
export function FamilyButton({
  children,
  label = 'Toggle panel',
  defaultOpen = false,
  open: controlled,
  onOpenChange,
  width = 220,
  height = 260,
  duration = 0.35,
  disabled = false,
  className,
}: FamilyButtonProps) {
  const reduced = usePrefersReducedMotion()
  const panelId = useId()
  const [inner, setInner] = useState(defaultOpen)
  const open = controlled ?? inner

  const setOpen = (next: boolean) => {
    if (disabled) return
    if (controlled === undefined) setInner(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const t = reduced ? { duration: 0 } : { type: 'spring' as const, damping: 26, stiffness: 320, duration }

  return (
    <div className={cn('inline-block rounded-[26px] border border-foreground/10 bg-card p-[3px] shadow-sm', className)}>
      <motion.div
        initial={false}
        animate={{ width: open ? width : CLOSED, height: open ? height : CLOSED, borderRadius: 22 }}
        transition={t}
        className="relative overflow-hidden border border-border bg-linear-to-b from-secondary to-card text-card-foreground"
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="panel"
              role="region"
              aria-label={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: reduced ? { duration: 0 } : { delay: 0.15, duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.1 } }}
              className="absolute inset-x-0 top-0 bottom-16 overflow-auto p-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            'absolute grid place-items-center text-foreground outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50',
            open
              ? 'bottom-3 left-1/2 size-10 -translate-x-1/2 rounded-full border border-border bg-background/60 hover:bg-background'
              : 'inset-0 rounded-[inherit] hover:bg-accent/60',
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
            className={cn('size-6 transition-transform duration-300 motion-reduce:transition-none', open && 'rotate-45')}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </motion.div>
    </div>
  )
}
