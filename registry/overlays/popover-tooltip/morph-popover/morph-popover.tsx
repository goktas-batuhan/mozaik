// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/morph-popover.tsx
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface MorphPopoverProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSubmit'> {
  /** The button's label. It slides up to become the panel's title. */
  label?: string
  /** Optional leading icon. Decorative. */
  icon?: ReactNode
  placeholder?: string
  /** Label of the button after a message was sent. */
  sentLabel?: string
  /** Called with the text when the form is submitted. */
  onSubmit?: (value: string) => void
  /** Edge of the button the panel grows from. */
  align?: 'start' | 'end'
  /** Width of the open panel in pixels. */
  width?: number
}

/** A button that morphs into a small form panel. Escape or a click outside folds it back. */
export function MorphPopover({
  label = 'Feedback',
  icon,
  placeholder = 'What is on your mind?',
  sentLabel = 'Thanks!',
  onSubmit,
  align = 'start',
  width = 300,
  className,
  ...props
}: MorphPopoverProps) {
  const reduced = usePrefersReducedMotion()
  const group = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [value, setValue] = useState('')
  const t = reduced ? { duration: 0 } : { type: 'spring' as const, duration: 0.42, bounce: 0.14 }

  const close = () => {
    setOpen(false)
    // Wait for the trigger to be back in the tree.
    requestAnimationFrame(() => trigger.current?.focus())
  }

  useEffect(() => {
    if (open) field.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit?.(value.trim())
    setValue('')
    setSent(true)
    close()
  }

  const shown = sent ? sentLabel : label
  const button = 'h-9 px-4 text-sm font-medium'

  return (
    <LayoutGroup id={group}>
      <div ref={root} {...props} className={cn('relative inline-flex', className)}>
        {/* keeps the button's footprint while the panel is open */}
        <span aria-hidden className={cn('invisible inline-flex items-center gap-2', button)}>
          {icon}
          {shown}
        </span>
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <motion.form
              key="panel"
              layoutId="surface"
              role="group"
              aria-label={label}
              onSubmit={submit}
              transition={t}
              style={{ width, borderRadius: 16 }}
              className={cn('absolute top-0 z-10 flex flex-col gap-3 border border-border bg-card p-3 text-card-foreground shadow-xl', align === 'end' ? 'right-0' : 'left-0')}
            >
              <motion.span layoutId="label" className="px-1 text-sm leading-5 font-medium">
                {label}
              </motion.span>
              <textarea
                ref={field}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                aria-label={label}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={close} className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  Cancel
                </button>
                <button type="submit" disabled={!value.trim()} className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50">
                  Send
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              key="button"
              ref={trigger}
              type="button"
              layoutId="surface"
              aria-haspopup="dialog"
              aria-expanded={false}
              onClick={() => {
                setSent(false)
                setOpen(true)
              }}
              transition={t}
              style={{ borderRadius: 999 }}
              className={cn('absolute top-0 left-0 inline-flex cursor-pointer items-center gap-2 border border-border bg-card whitespace-nowrap text-card-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', button, align === 'end' && 'right-0 left-auto')}
            >
              {icon ? (
                <span aria-hidden className="[&_svg]:size-4">
                  {icon}
                </span>
              ) : null}
              <motion.span layoutId="label">{shown}</motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
