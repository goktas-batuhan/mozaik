// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/dock.tsx
import { motion, useMotionValue, useReducedMotion, useReducedMotionConfig, useSpring, useTransform, type MotionValue } from 'motion/react'
import { createContext, useContext, useRef, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


interface DockContextValue {
  mouseX: MotionValue<number>
  size: number
  magnification: number
  distance: number
}

const DockContext = createContext<DockContextValue | null>(null)

export interface DockProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Put DockIcon elements here. Each one should wrap a link or a button. */
  children: ReactNode
  /** Resting size of each icon in pixels. */
  iconSize?: number
  /** Size of the icon under the pointer in pixels. */
  iconMagnification?: number
  /** Distance in pixels over which the magnification fades out. */
  iconDistance?: number
  /** Which edge the icons grow from. */
  direction?: 'top' | 'middle' | 'bottom'
  /** Turns the magnification off. */
  disabled?: boolean
  className?: string
  ref?: Ref<HTMLDivElement>
}

/** A row of icons that swell as the pointer approaches. Touch and reduced motion keep them at rest. */
export function Dock({
  children,
  iconSize = 40,
  iconMagnification = 64,
  iconDistance = 140,
  direction = 'bottom',
  disabled = false,
  className,
  ref,
  ...props
}: DockProps) {
  const mouseX = useMotionValue(Infinity)
  const reduced = usePrefersReducedMotion()
  const off = disabled || !!reduced

  return (
    <DockContext.Provider
      value={{
        mouseX,
        size: iconSize,
        magnification: off ? iconSize : iconMagnification,
        distance: iconDistance,
      }}
    >
      <div
        role="group"
        {...props}
        ref={ref}
        style={{ height: iconSize + 18, ...props.style }}
        onPointerMove={(e) => {
          if (e.pointerType === 'mouse') mouseX.set(e.clientX)
          props.onPointerMove?.(e)
        }}
        onPointerLeave={(e) => {
          mouseX.set(Infinity)
          props.onPointerLeave?.(e)
        }}
        className={cn(
          'mx-auto flex w-max justify-center gap-2 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-md',
          direction === 'top' && 'items-start',
          direction === 'middle' && 'items-center',
          direction === 'bottom' && 'items-end',
          className,
        )}
      >
        {children}
      </div>
    </DockContext.Provider>
  )
}

export interface DockIconProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Usually a link or a button. It fills the icon. */
  children?: ReactNode
  className?: string
}

/** One slot in the dock. */
export function DockIcon({ children, className, ...props }: DockIconProps) {
  const ctx = useContext(DockContext)
  if (!ctx) throw new Error('DockIcon must be rendered inside Dock')
  const { mouseX, size, magnification, distance } = ctx

  const ref = useRef<HTMLDivElement>(null)
  const offset = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect()
    return bounds ? x - bounds.x - bounds.width / 2 : Infinity
  })
  const target = useTransform(offset, [-distance, 0, distance], [size, magnification, size])
  const dimension = useSpring(target, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      {...(props as object)}
      ref={ref}
      style={{ width: dimension, height: dimension }}
      className={cn('flex aspect-square shrink-0 items-center justify-center', className)}
    >
      <div className="grid size-full place-items-center">{children}</div>
    </motion.div>
  )
}
