// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/shift-card.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ShiftCardProps {
  /** Always visible at the top. */
  topContent?: ReactNode
  /** Fades in below `topContent` while the card is expanded. */
  topRevealContent?: ReactNode
  /** Centre content that fades out while the card is expanded. */
  middleContent?: ReactNode
  /** Bottom panel. A peek stays visible at rest and the rest opens on hover, focus or click. */
  bottomContent?: ReactNode
  /** Height in pixels of the bottom peek at rest. */
  collapsedHeight?: number
  /** Seconds the panel takes to open. */
  duration?: number
  /** Keeps the card closed. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

/** A card whose bottom panel grows over the middle when you hover, focus or click it. */
export function ShiftCard({
  topContent,
  topRevealContent,
  middleContent,
  bottomContent,
  collapsedHeight = 44,
  duration = 0.3,
  disabled = false,
  className,
}: ShiftCardProps) {
  const reduced = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = !disabled && (hovered || focused || pinned)
  const t = reduced ? { duration: 0 } : { duration, ease: [0.32, 0.72, 0, 1] as const }

  return (
    <article
      tabIndex={disabled ? -1 : 0}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => setPinned((p) => !p)}
      className={cn(
        'relative flex min-h-[300px] w-[300px] max-w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card p-4 text-sm text-card-foreground shadow-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring',
        open && 'shadow-md',
        disabled && 'cursor-default',
        className,
      )}
    >
      <div>
        {topContent}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={t}
            >
              {topRevealContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="flex flex-1 items-center justify-center pb-12"
        initial={false}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.96 : 1 }}
        transition={t}
        aria-hidden={open || undefined}
      >
        {middleContent}
      </motion.div>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : collapsedHeight }}
        transition={t}
        className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-xl border-t border-border bg-secondary/70 px-4 py-3 backdrop-blur"
      >
        {bottomContent}
      </motion.div>
    </article>
  )
}
