import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ClipCornersButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Size in pixels of the cut at each corner when idle. */
  cut?: number
  /** Size in pixels of the cut while hovered or focused. */
  hoverCut?: number
  ref?: Ref<HTMLButtonElement>
}

/** An octagon-style polygon: all four corners shaved by `c` pixels. */
function clip(c: number) {
  return `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`
}

/** A tech-style button with shaved corners that cut deeper on hover and focus. */
export function ClipCornersButton({
  cut = 10,
  hoverCut = 18,
  className,
  children,
  type = 'button',
  disabled,
  ref,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: ClipCornersButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const active = (hover || focus) && !disabled
  const size = active ? hoverCut : cut
  const transition = reduced ? undefined : 'clip-path 250ms ease-out, background-color 250ms ease-out'

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      data-active={active || undefined}
      onPointerEnter={(e) => {
        setHover(true)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        setHover(false)
        onPointerLeave?.(e)
      }}
      onFocus={(e) => {
        setFocus(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocus(false)
        onBlur?.(e)
      }}
      style={{ clipPath: clip(size), transition, ...props.style }}
      className={cn(
        'group relative inline-flex h-12 cursor-pointer items-center justify-center px-8 text-sm font-medium tracking-wide whitespace-nowrap text-foreground',
        'bg-foreground/30 outline-none focus-visible:bg-ring data-active:bg-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-px bg-card"
        style={{ clipPath: clip(Math.max(size - 1, 0)), transition }}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  )
}
