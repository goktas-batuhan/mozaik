// Source: original
import { createRef, useId, useMemo, useRef, type ElementType, type ReactNode, type RefObject } from 'react'
import { AnimatedBeam } from '@/components/animated-beam'
import { cn } from '@/lib/utils'

export interface IntegrationNode {
  /** Name of the tool. Read by assistive tech. */
  label: string
  /** Logo or initial shown inside the round node. */
  icon: ReactNode
}

export interface FeaturesIntegrationsBeamProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Short selling points listed under the copy. */
  points?: string[]
  /** Tools on the left of the hub. */
  sources: IntegrationNode[]
  /** Tools on the right of the hub. */
  targets: IntegrationNode[]
  /** Center of the diagram: your product's mark. */
  hub: ReactNode
  /** Name of the hub for assistive tech. */
  hubLabel?: string
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Stops the beams and shows the diagram still. */
  disabled?: boolean
  className?: string
}

function Node({ nodeRef, label, children, large }: { nodeRef: RefObject<HTMLDivElement | null>; label: string; children: ReactNode; large?: boolean }) {
  return (
    <div
      ref={nodeRef}
      role="img"
      aria-label={label}
      className={cn(
        'z-10 grid place-items-center rounded-full border bg-card text-sm font-semibold text-card-foreground shadow-sm',
        large ? 'size-16 border-2 border-primary text-primary' : 'size-12 border-border',
      )}
    >
      {children}
    </div>
  )
}

/** Copy and selling points beside a hub diagram where beams of light connect tools to your product. Built on Animated Beam. */
export function FeaturesIntegrationsBeam({
  title,
  description,
  points,
  sources,
  targets,
  hub,
  hubLabel = 'Hub',
  titleAs: Title = 'h2',
  as: Tag = 'section',
  disabled = false,
  className,
}: FeaturesIntegrationsBeamProps) {
  const id = useId()
  const container = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const sourceRefs = useMemo(() => Array.from({ length: sources.length }, () => createRef<HTMLDivElement>()), [sources.length])
  const targetRefs = useMemo(() => Array.from({ length: targets.length }, () => createRef<HTMLDivElement>()), [targets.length])

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid items-center gap-10 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @3xl:gap-14">
        <div className="flex flex-col items-start gap-4">
          <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
            {title}
          </Title>
          {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          {points && points.length > 0 && (
            <ul className="mt-2 flex flex-col gap-2.5 text-sm text-foreground">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          ref={container}
          className="relative flex h-80 items-center justify-between overflow-hidden rounded-2xl border border-border bg-background px-6 @xl:px-12"
        >
          <div className="flex flex-col gap-6">
            {sources.map((s, i) => (
              <Node key={s.label} nodeRef={sourceRefs[i]} label={s.label}>
                {s.icon}
              </Node>
            ))}
          </div>
          <Node nodeRef={hubRef} label={hubLabel} large>
            {hub}
          </Node>
          <div className="flex flex-col gap-6">
            {targets.map((t, i) => (
              <Node key={t.label} nodeRef={targetRefs[i]} label={t.label}>
                {t.icon}
              </Node>
            ))}
          </div>
          {sourceRefs.map((ref, i) => (
            <AnimatedBeam
              key={`s${i}`}
              containerRef={container}
              fromRef={ref}
              toRef={hubRef}
              curvature={(i - (sources.length - 1) / 2) * 24}
              delay={i * 0.4}
              disabled={disabled}
            />
          ))}
          {targetRefs.map((ref, i) => (
            <AnimatedBeam
              key={`t${i}`}
              containerRef={container}
              fromRef={ref}
              toRef={hubRef}
              curvature={(i - (targets.length - 1) / 2) * -24}
              delay={i * 0.4 + 0.2}
              reverse
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </Tag>
  )
}
