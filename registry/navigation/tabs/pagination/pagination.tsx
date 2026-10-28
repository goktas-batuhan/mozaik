// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/pagination/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useMemo } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PaginationProps {
  /** Current page, starting at 1. */
  page: number
  /** Total number of pages. */
  totalPages: number
  /** Called with the new page when the user picks one. */
  onPageChange: (page: number) => void
  /** Pages shown on each side of the current one. */
  siblings?: number
  /** Seconds the sliding indicator and entrance take. */
  duration?: number
  /** Extra classes for the nav element. */
  className?: string
}

const ELLIPSIS = 'ellipsis' as const
type PageItem = number | typeof ELLIPSIS

const STAGGER = 0.03

/** Page numbers with ellipses, always showing the first and last page. */
export function buildPageRange(page: number, totalPages: number, siblings: number): PageItem[] {
  const totalSlots = siblings * 2 + 5
  if (totalPages <= totalSlots) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const left = Math.max(page - siblings, 2)
  const right = Math.min(page + siblings, totalPages - 1)
  const items: PageItem[] = [1]

  if (left > 2) items.push(ELLIPSIS)
  else for (let i = 2; i < left; i++) items.push(i)

  for (let i = left; i <= right; i++) items.push(i)

  if (right < totalPages - 1) items.push(ELLIPSIS)
  else for (let i = right + 1; i < totalPages; i++) items.push(i)

  items.push(totalPages)
  return items
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

const buttonBase =
  'relative inline-flex h-9 items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50'

/** Page navigation with a sliding active-page indicator. */
export function Pagination({ page, totalPages, onPageChange, siblings = 1, duration = 0.25, className }: PaginationProps) {
  const reduced = usePrefersReducedMotion()
  const still = reduced || duration <= 0
  const layoutId = `pagination-active-${useId()}`
  const items = useMemo(() => buildPageRange(page, totalPages, siblings), [page, totalPages, siblings])

  const enter = (index: number) => ({
    initial: still ? (false as const) : { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    transition: still ? { duration: 0 } : { duration, ease: 'easeOut' as const, delay: index * STAGGER },
  })

  return (
    <nav aria-label="Pagination" className={cn('mx-auto flex w-full justify-center', className)}>
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            type="button"
            aria-label="Go to previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={cn(buttonBase, 'px-2.5 text-muted-foreground')}
          >
            <Chevron dir="left" />
            <span className="hidden sm:block">Previous</span>
          </button>
        </li>

        {items.map((item, index) => {
          if (item === ELLIPSIS) {
            return (
              <li key={`ellipsis-${index}`} aria-hidden className="flex size-9 items-center justify-center">
                <motion.span className="text-sm text-muted-foreground" {...enter(index)}>
                  …
                </motion.span>
              </li>
            )
          }
          const active = item === page
          return (
            <motion.li key={item} {...enter(index)}>
              <button
                type="button"
                aria-label={`Go to page ${item}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                className={cn(buttonBase, 'size-9', active ? 'text-foreground' : 'text-muted-foreground')}
              >
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-md border border-border bg-background shadow-sm"
                    transition={still ? { duration: 0 } : { type: 'spring', duration, bounce: 0.05 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </button>
            </motion.li>
          )
        })}

        <li>
          <button
            type="button"
            aria-label="Go to next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className={cn(buttonBase, 'px-2.5 text-muted-foreground')}
          >
            <span className="hidden sm:block">Next</span>
            <Chevron dir="right" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
