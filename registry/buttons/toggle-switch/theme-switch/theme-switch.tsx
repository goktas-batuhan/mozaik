// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/switch-button.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type ThemeSwitchTheme = 'light' | 'dark'

export interface ThemeSwitchProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  /** Controlled theme. */
  theme?: ThemeSwitchTheme
  /** Initial theme when uncontrolled. */
  defaultTheme?: ThemeSwitchTheme
  /** Called with the theme to switch to. The button never touches the document: apply the theme here. */
  onThemeChange?: (theme: ThemeSwitchTheme) => void
  /** Show a text label next to the icon. */
  showLabel?: boolean
  /** Button size. */
  size?: 'sm' | 'md' | 'lg'
  ref?: Ref<HTMLButtonElement>
}

const SIZES = {
  sm: { button: 'h-8 gap-1.5 px-2.5 text-[13px]', square: 'w-8 px-0', icon: 14 },
  md: { button: 'h-9 gap-2 px-3 text-sm', square: 'w-9 px-0', icon: 16 },
  lg: { button: 'h-10 gap-2 px-3.5 text-[15px]', square: 'w-10 px-0', icon: 18 },
}

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

/** A sun and moon button. The sun's disc is bitten into a crescent by a sliding mask and its rays fold away. */
export function ThemeSwitch({
  theme,
  defaultTheme = 'light',
  onThemeChange,
  showLabel = false,
  size = 'md',
  className,
  type = 'button',
  onClick,
  ref,
  ...props
}: ThemeSwitchProps) {
  const reduced = usePrefersReducedMotion()
  const maskId = useId()
  const [inner, setInner] = useState<ThemeSwitchTheme>(defaultTheme)
  const current = theme ?? inner
  const dark = current === 'dark'
  const s = SIZES[size]
  const move = reduced ? { duration: 0 } : { type: 'spring' as const, duration: 0.45, bounce: 0.15 }

  return (
    <button
      aria-label={showLabel ? undefined : 'Dark mode'}
      {...props}
      ref={ref}
      type={type}
      role="switch"
      aria-checked={dark}
      data-theme={current}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const next: ThemeSwitchTheme = dark ? 'light' : 'dark'
        if (theme === undefined) setInner(next)
        onThemeChange?.(next)
      }}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card font-medium text-card-foreground select-none',
        !reduced && 'transition-colors',
        'hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        s.button,
        !showLabel && s.square,
        className,
      )}
    >
      <svg aria-hidden width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <defs>
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            <motion.circle r="7" cy="7" fill="black" initial={false} animate={{ cx: dark ? 16 : 32 }} transition={move} />
          </mask>
        </defs>
        <motion.circle
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ scale: dark ? 1.15 : 1 }}
          style={{ originX: '12px', originY: '12px' }}
          transition={move}
        />
        <motion.g initial={false} animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.6 : 1, rotate: dark ? 45 : 0 }} style={{ originX: '12px', originY: '12px' }} transition={move}>
          {RAYS.map((deg) => (
            <path key={deg} d="M12 2.5v2.2" transform={`rotate(${deg} 12 12)`} />
          ))}
        </motion.g>
      </svg>
      {showLabel ? <span>{dark ? 'Dark' : 'Light'}</span> : null}
    </button>
  )
}
