// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/fluid-hover-highlight/index.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig, type Transition } from 'motion/react'
import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type RefObject,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

/** A box in the container's coordinate space, in pixels. */
export interface ItemRect {
  top: number
  left: number
  width: number
  height: number
}

export interface FluidHoverHighlightProps {
  /** Box to highlight, in the container's coordinate space. `null` fades the highlight out. */
  rect: ItemRect | null
  /** Changes every time the pointer enters the container, so a fresh highlight fades in instead of travelling. */
  session?: number
  /** Where a fresh highlight fades in from, for example a checked row. */
  from?: ItemRect | null
  /** Positional spring. `false` snaps with no travel. */
  transition?: Transition | false
  /** Radius, colour and z-index. Defaults to a faint foreground fill. */
  className?: string
}

const SPRING: Transition = { type: 'spring', bounce: 0, duration: 0.08 }
const FADE: Transition = { duration: 0.08 }
const SNAP: Transition = { duration: 0 }

const toTarget = (rect: ItemRect) => ({ height: rect.height, width: rect.width, x: rect.left, y: rect.top })

/**
 * An absolute fill that springs between item boxes.
 * The container must be `position: relative`; the highlight owns no radius or z-index, pass them with `className`.
 */
export function FluidHoverHighlight({ rect, session = 0, from, transition, className }: FluidHoverHighlightProps) {
  const reduced = usePrefersReducedMotion()
  const positional = transition === false || reduced ? SNAP : (transition ?? SPRING)

  return (
    <AnimatePresence>
      {rect ? (
        <motion.div
          key={session}
          data-slot="fluid-hover-highlight"
          aria-hidden="true"
          className={cn('pointer-events-none absolute top-0 left-0 bg-foreground/5', className)}
          style={{ position: 'absolute' }}
          initial={{ opacity: 0, ...toTarget(from ?? rect) }}
          animate={{ opacity: 1, ...toTarget(rect) }}
          exit={{ opacity: 0, transition: reduced ? SNAP : { duration: 0.06 } }}
          transition={{ ...positional, opacity: reduced ? SNAP : FADE }}
        />
      ) : null}
    </AnimatePresence>
  )
}

export interface UseFluidHoverOptions {
  /** Which direction picks the nearest item: `y` for lists, `x` for strips, `xy` for grids. */
  axis?: 'x' | 'y' | 'xy'
}

export interface UseFluidHoverReturn {
  /** Index of the lit item, or `null`. */
  activeIndex: number | null
  /** Box of the lit item, ready for `<FluidHoverHighlight rect={...} />`. */
  rect: ItemRect | null
  /** Pass to `<FluidHoverHighlight session={...} />`. */
  session: number
  /** Props for the container: pointer tracking. */
  containerProps: {
    onPointerEnter: () => void
    onPointerMove: (event: PointerEvent<HTMLElement>) => void
    onPointerLeave: () => void
    onBlur: (event: FocusEvent<HTMLElement>) => void
  }
  /** Props for item `index`: a ref and focus tracking, so the keyboard lights the same highlight. */
  getItemProps: (index: number) => {
    ref: (element: HTMLElement | null) => void
    onFocus: () => void
  }
}

/**
 * Tracks the item nearest to the pointer so one highlight can glide between rows
 * instead of blinking on `:hover`. An item the pointer is inside wins; otherwise the
 * item whose centre is nearest does. Focus moves the highlight too.
 */
export function useFluidHover(
  containerRef: RefObject<HTMLElement | null>,
  { axis = 'y' }: UseFluidHoverOptions = {},
): UseFluidHoverReturn {
  const items = useRef(new Map<number, HTMLElement>())
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [rect, setRect] = useState<ItemRect | null>(null)
  const [session, setSession] = useState(0)

  const measure = useCallback(
    (index: number): ItemRect | null => {
      const container = containerRef.current
      const element = items.current.get(index)
      if (!container || !element) return null
      const c = container.getBoundingClientRect()
      const r = element.getBoundingClientRect()
      return {
        top: r.top - c.top - container.clientTop + container.scrollTop,
        left: r.left - c.left - container.clientLeft + container.scrollLeft,
        width: r.width,
        height: r.height,
      }
    },
    [containerRef],
  )

  const activate = useCallback(
    (index: number | null) => {
      setActiveIndex(index)
      setRect(index === null ? null : measure(index))
    },
    [measure],
  )

  const nearest = (x: number, y: number) => {
    let inside: number | null = null
    let closest: number | null = null
    let best = Number.POSITIVE_INFINITY
    for (const [index, element] of items.current) {
      const r = element.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) inside = index
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const distance = axis === 'x' ? Math.abs(x - cx) : axis === 'y' ? Math.abs(y - cy) : Math.hypot(x - cx, y - cy)
      if (distance < best) {
        best = distance
        closest = index
      }
    }
    return inside ?? closest
  }

  return {
    activeIndex,
    rect,
    session,
    containerProps: {
      onPointerEnter: () => setSession((s) => s + 1),
      onPointerMove: (event) => {
        if (event.pointerType === 'touch') return
        activate(nearest(event.clientX, event.clientY))
      },
      onPointerLeave: () => activate(null),
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) activate(null)
      },
    },
    getItemProps: (index) => ({
      ref: (element) => {
        if (element) items.current.set(index, element)
        else items.current.delete(index)
      },
      onFocus: () => activate(index),
    }),
  }
}
