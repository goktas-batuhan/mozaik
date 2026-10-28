// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Terminal, TerminalLine, TerminalTyping } from '@/components/terminal'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroTerminalInstallProps {
  title: ReactNode
  description?: ReactNode
  /** Command shown in the copy box and typed into the terminal. */
  command?: string
  /** Lines printed in the terminal after the command. */
  output?: string[]
  /** Text in the terminal's title bar. */
  terminalTitle?: string
  /** Link under the command, e.g. "Read the docs". */
  link?: { label: ReactNode; href: string }
  /** Fires after the command is copied. */
  onCopy?: (command: string) => void
  /** Seconds each piece takes to fade in. */
  duration?: number
  /** Seconds between pieces. */
  stagger?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Turns the entrance animation off and shows the terminal in full. */
  disabled?: boolean
  className?: string
}

/** Developer hero: copyable install command on the left, a terminal that plays the install on the right. */
export function HeroTerminalInstall({
  title,
  description,
  command = 'npx shadcn add mozaik/shimmer-button',
  output = ['Resolving dependencies…', '✔ Added shimmer-button.tsx', '✔ Installed motion'],
  terminalTitle = '~/my-app',
  link,
  onCopy,
  duration = 0.6,
  stagger = 0.09,
  delay = 0,
  disabled = false,
  className,
}: HeroTerminalInstallProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [copied, setCopied] = useState(false)
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 16 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(command)
    } catch {
      /* clipboard can be blocked; the state below still confirms the click */
    }
    setCopied(true)
    onCopy?.(command)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className={cn('@container w-full', className)}>
      <div className="grid items-center gap-10 @4xl:grid-cols-2 @4xl:gap-14">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <motion.h1 {...reveal(0)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground @xl:text-5xl">
            {title}
          </motion.h1>
          {description != null && (
            <motion.p {...reveal(1)} className="max-w-lg text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
              {description}
            </motion.p>
          )}
          <motion.div {...reveal(2)} className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-muted/50 py-1.5 pr-1.5 pl-4 font-mono text-sm">
            <span aria-hidden className="text-primary">
              $
            </span>
            <code className="min-w-0 flex-1 truncate text-foreground">{command}</code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 font-sans text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </motion.div>
          {link && (
            <motion.a {...reveal(3)} href={link.href} className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {link.label}
            </motion.a>
          )}
        </div>
        <motion.div {...reveal(2)} className="min-w-0">
          <Terminal title={terminalTitle} className="max-w-none" disabled={disabled}>
            <TerminalTyping>{`$ ${command}`}</TerminalTyping>
            {output.map((line, i) => (
              <TerminalLine key={i} className="text-muted-foreground">
                {line}
              </TerminalLine>
            ))}
          </Terminal>
        </motion.div>
      </div>
    </section>
  )
}
