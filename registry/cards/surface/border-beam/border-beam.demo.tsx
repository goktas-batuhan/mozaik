import type { ReactNode } from 'react'
import { BorderBeam, type BorderBeamProps } from './border-beam'

function PlanCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[min(26rem,90vw)] overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Pro plan</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight">Everything, unlocked</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        A single light walks the edge of the card. Nothing else on the page moves.
      </p>
      <button
        type="button"
        className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Get started
      </button>
      {children}
    </div>
  )
}

export default function BorderBeamDemo() {
  return (
    <PlanCard>
      <BorderBeam size={120} duration={7} />
      <BorderBeam size={120} duration={7} delay={3.5} colorFrom="var(--foreground)" colorTo="var(--primary)" />
    </PlanCard>
  )
}

export function VariantPreview(props: BorderBeamProps) {
  return (
    <PlanCard>
      <BorderBeam {...props} />
    </PlanCard>
  )
}
