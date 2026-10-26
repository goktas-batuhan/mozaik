import { createRef, forwardRef, useRef, type ReactNode } from 'react'
import { AnimatedBeam } from './animated-beam'

const Node = forwardRef<HTMLDivElement, { label: string; children: ReactNode; large?: boolean }>(
  ({ label, children, large }, ref) => (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={
        large
          ? 'z-10 grid size-16 place-items-center rounded-full border-2 border-primary bg-card text-primary shadow-sm'
          : 'z-10 grid size-12 place-items-center rounded-full border bg-card text-sm font-semibold text-card-foreground shadow-sm'
      }
    >
      {children}
    </div>
  ),
)
Node.displayName = 'Node'

const LEFT = ['Docs', 'Mail', 'Chat']
const RIGHT = ['Git', 'Pay', 'Data']

export default function AnimatedBeamDemo() {
  const container = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const left = useRef(LEFT.map(() => createRef<HTMLDivElement>())).current
  const right = useRef(RIGHT.map(() => createRef<HTMLDivElement>())).current

  return (
    <div
      ref={container}
      className="relative flex h-[320px] w-[min(92vw,520px)] items-center justify-between overflow-hidden rounded-2xl border bg-background px-6 sm:px-10"
    >
      <div className="flex flex-col gap-6">
        {LEFT.map((name, i) => (
          <Node key={name} ref={left[i]} label={name}>
            {name[0]}
          </Node>
        ))}
      </div>
      <Node ref={hub} label="Mozaik hub" large>
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
      </Node>
      <div className="flex flex-col gap-6">
        {RIGHT.map((name, i) => (
          <Node key={name} ref={right[i]} label={name}>
            {name[0]}
          </Node>
        ))}
      </div>

      {left.map((ref, i) => (
        <AnimatedBeam key={`l${i}`} containerRef={container} fromRef={ref} toRef={hub} curvature={(i - 1) * 24} delay={i * 0.4} />
      ))}
      {right.map((ref, i) => (
        <AnimatedBeam key={`r${i}`} containerRef={container} fromRef={ref} toRef={hub} curvature={(i - 1) * -24} delay={i * 0.4 + 0.2} reverse />
      ))}
    </div>
  )
}
