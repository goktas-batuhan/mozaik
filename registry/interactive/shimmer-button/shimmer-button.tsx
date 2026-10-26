// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/shimmer-button.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ComponentPropsWithoutRef, CSSProperties, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Color of the light that circles the edge. Any CSS color; defaults to the primary token. */
  shimmerColor?: string
  /** Thickness of the lit edge in pixels. */
  shimmerSize?: number
  /** Fill of the button. Any CSS color or gradient; defaults to the card token. */
  background?: string
  /** Seconds for the light to circle the button once. */
  duration?: number
  /** Disables the button and stops the shimmer. */
  disabled?: boolean
  ref?: Ref<HTMLButtonElement>
}

/** A button with a light that circles its edge. */
export function ShimmerButton({
  shimmerColor = 'var(--primary)',
  shimmerSize = 2,
  background = 'var(--card)',
  duration = 3,
  disabled = false,
  className,
  children,
  type = 'button',
  ref,
  ...props
}: ShimmerButtonProps) {
  const reduced = usePrefersReducedMotion()
  const still = disabled || !!reduced

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      style={
        {
          '--shimmer-color': shimmerColor,
          '--shimmer-bg': background,
          '--shimmer-size': `${shimmerSize}px`,
          ...props.style,
        } as CSSProperties
      }
      className={cn(
        'group relative isolate inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-border px-6 py-3 text-sm font-medium whitespace-nowrap text-card-foreground',
        'transition-transform duration-300 ease-out active:translate-y-px',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {/* light */}
      <span aria-hidden className="absolute inset-0 -z-20 overflow-hidden rounded-[inherit]">
        <motion.span
          className="absolute top-1/2 left-1/2 aspect-square w-[300%] [background:conic-gradient(from_0deg,transparent_0deg,transparent_240deg,var(--shimmer-color)_330deg,transparent_360deg)]"
          style={{ x: '-50%', y: '-50%' }}
          animate={still ? undefined : { rotate: 360 }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
        />
      </span>
      {/* fill, inset so only the edge stays lit */}
      <span
        aria-hidden
        className="absolute inset-(--shimmer-size) -z-10 rounded-[inherit] [background:var(--shimmer-bg)]"
      />
      {/* soft top highlight */}
      <span
        aria-hidden
        className="absolute inset-(--shimmer-size) -z-10 rounded-[inherit] bg-linear-to-b from-foreground/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </button>
  )
}
