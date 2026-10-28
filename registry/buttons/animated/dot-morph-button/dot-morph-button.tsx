// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/dot-morph-button/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

export interface DotMorphButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Text next to the dot. */
  label: string
  ref?: Ref<HTMLButtonElement>
}

/** A pill button whose leading dot stretches into a bar on hover and focus. */
export function DotMorphButton({
  label,
  className,
  type = 'button',
  disabled,
  ref,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: DotMorphButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY)
    setCanHover(query.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const morphed = !reduced && !disabled && ((hover && canHover) || focus)

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      data-morphed={morphed || undefined}
      onPointerEnter={(e) => {
        setHover(true)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        setHover(false)
        onPointerLeave?.(e)
      }}
      onFocus={(e) => {
        setFocus(e.currentTarget.matches(':focus-visible'))
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocus(false)
        onBlur?.(e)
      }}
      className={cn(
        'inline-flex h-12 cursor-pointer items-center gap-3 rounded-full border border-border bg-background px-6 text-lg font-medium whitespace-nowrap text-foreground select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      <span aria-hidden className="flex h-7 w-4 items-center justify-center">
        <motion.span
          data-slot="dot"
          className="block bg-primary"
          initial={false}
          animate={morphed ? { width: 12, height: 28 } : { width: 16, height: 16 }}
          style={{ borderRadius: 999 }}
          transition={{ type: 'spring', stiffness: 600, damping: 22 }}
        />
      </span>
      {label}
    </button>
  )
}
