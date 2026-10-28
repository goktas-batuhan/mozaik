// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/card-flip.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

export interface CardFlipProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'onChange'> {
  /** Content of the front face. Non-interactive: the card itself is the button. */
  front: ReactNode
  /** Content of the back face. */
  back: ReactNode
  /** `hover` also flips while a mouse is over the card; every trigger flips on click, Enter and Space. */
  trigger?: 'click' | 'hover'
  /** Axis the card turns around. */
  axis?: 'x' | 'y'
  /** Controlled state. `true` shows the back. */
  flipped?: boolean
  /** Initial state when uncontrolled. */
  defaultFlipped?: boolean
  /** Called with the new state. */
  onFlippedChange?: (flipped: boolean) => void
  ref?: Ref<HTMLButtonElement>
}

/** A card that turns over to show its back, on click, keyboard or (optionally) hover. */
export function CardFlip({
  front,
  back,
  trigger = 'click',
  axis = 'y',
  flipped,
  defaultFlipped = false,
  onFlippedChange,
  className,
  type = 'button',
  onClick,
  onPointerEnter,
  onPointerLeave,
  ref,
  ...props
}: CardFlipProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = useState(defaultFlipped)
  const [canHover, setCanHover] = useState(false)
  const on = flipped ?? inner

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setCanHover(query.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const set = (next: boolean) => {
    if (flipped === undefined) setInner(next)
    onFlippedChange?.(next)
  }
  const prop = axis === 'y' ? 'rotateY' : 'rotateX'

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-pressed={on}
      data-flipped={on || undefined}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) set(!on)
      }}
      onPointerEnter={(e) => {
        onPointerEnter?.(e)
        if (trigger === 'hover' && canHover && e.pointerType === 'mouse' && !on) set(true)
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        if (trigger === 'hover' && canHover && e.pointerType === 'mouse' && on) set(false)
      }}
      style={{ perspective: 1200, ...props.style }}
      className={cn(
        'relative block h-56 w-72 cursor-pointer rounded-2xl text-left outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      <motion.span
        className="absolute inset-0 block"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ [prop]: on ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 22 }}
      >
        <span
          data-face="front"
          aria-hidden={on}
          className="absolute inset-0 block overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </span>
        <span
          data-face="back"
          aria-hidden={!on}
          className="absolute inset-0 block overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground shadow-md"
          style={{ backfaceVisibility: 'hidden', transform: axis === 'y' ? 'rotateY(180deg)' : 'rotateX(180deg)' }}
        >
          {back}
        </span>
      </motion.span>
    </button>
  )
}
