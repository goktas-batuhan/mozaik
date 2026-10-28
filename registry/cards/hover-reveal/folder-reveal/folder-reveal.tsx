// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/folder-reveal/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

export interface FolderRevealItem {
  /** Unique key. */
  id: string
  /** What the card inside shows. */
  content: ReactNode
}

export interface FolderRevealProps {
  /** Cards kept in the folder. Five or fewer read best. */
  items: FolderRevealItem[]
  /** Accessible name of the folder button. */
  label?: string
  /** `hover` opens under a mouse; both triggers toggle on click and keyboard. */
  trigger?: 'hover' | 'click'
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called with the new open state. */
  onOpenChange?: (open: boolean) => void
  /** Folder width in pixels. Height follows. */
  size?: number
  /** Horizontal distance in pixels between fanned cards. */
  spread?: number
  /** Degrees of rotation per card as the fan opens. */
  rotation?: number
  /** Extra classes for the folder button. */
  className?: string
}

/** A folder that fans its cards out when opened. The flap tips forward and the cards rise out of it. */
export function FolderReveal({
  items,
  label = 'Folder',
  trigger = 'hover',
  open,
  defaultOpen = false,
  onOpenChange,
  size = 260,
  spread = 56,
  rotation = 7,
  className,
}: FolderRevealProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = useState(defaultOpen)
  const [canHover, setCanHover] = useState(false)
  const isOpen = open ?? inner
  const height = Math.round(size * 0.78)

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setCanHover(query.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const set = (next: boolean) => {
    if (open === undefined) setInner(next)
    onOpenChange?.(next)
  }
  const hover = trigger === 'hover'
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 24 }
  const mid = (items.length - 1) / 2

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-label={label}
      data-open={isOpen || undefined}
      onClick={() => set(!isOpen)}
      onPointerEnter={(e) => {
        if (hover && canHover && e.pointerType === 'mouse' && !isOpen) set(true)
      }}
      onPointerLeave={(e) => {
        if (hover && canHover && e.pointerType === 'mouse' && isOpen) set(false)
      }}
      style={{ width: size, height, perspective: 1000 }}
      className={cn('relative block cursor-pointer rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring', className)}
    >
      {/* back panel with its tab */}
      <span aria-hidden className="absolute inset-x-0 top-[8%] bottom-0 block rounded-xl border border-border bg-secondary" />
      <span aria-hidden className="absolute top-0 left-0 block h-[12%] w-[38%] rounded-t-lg border border-b-0 border-border bg-secondary" />
      {items.map((item, i) => {
        const offset = i - mid
        return (
          <motion.span
            key={item.id}
            data-slot="card"
            initial={false}
            animate={
              isOpen
                ? { x: offset * spread, y: -height * 0.34, rotate: offset * rotation }
                : { x: 0, y: -height * 0.04, rotate: 0 }
            }
            transition={reduced ? { duration: 0 } : { ...spring, delay: isOpen ? Math.abs(offset) * 0.03 : 0 }}
            style={{ left: '20%', width: '60%', height: '52%', bottom: '14%', zIndex: i + 1 }}
            className="absolute block overflow-hidden rounded-lg border border-border bg-card text-left text-card-foreground shadow-md"
          >
            {item.content}
          </motion.span>
        )
      })}
      {/* front flap */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ rotateX: isOpen ? -30 : 0 }}
        transition={spring}
        style={{ transformOrigin: 'bottom', zIndex: items.length + 2 }}
        className="absolute inset-x-0 bottom-0 block h-[58%] rounded-xl border border-border bg-muted"
      />
    </button>
  )
}
