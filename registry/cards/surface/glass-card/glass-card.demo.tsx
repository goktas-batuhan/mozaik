import { GlassCard, type GlassCardProps } from './glass-card'

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-80 w-full max-w-xl items-center justify-center overflow-hidden rounded-3xl bg-background p-8">
      <span aria-hidden className="absolute -top-10 -left-10 size-56 rounded-full bg-primary/70 blur-2xl" />
      <span aria-hidden className="absolute right-0 -bottom-12 size-64 rounded-full bg-accent blur-2xl" />
      <span aria-hidden className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary blur-xl" />
      {children}
    </div>
  )
}

export default function GlassCardDemo() {
  return (
    <Backdrop>
      <GlassCard className="w-72">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">Balance</p>
        <p className="mt-2 text-3xl font-semibold">$12,480</p>
        <p className="mt-4 text-sm text-muted-foreground">Move your pointer across the pane to catch the light.</p>
      </GlassCard>
    </Backdrop>
  )
}

export function VariantPreview(props: GlassCardProps) {
  return (
    <Backdrop>
      <GlassCard className="w-72" {...props}>
        <p className="text-xs tracking-widest text-muted-foreground uppercase">Balance</p>
        <p className="mt-2 text-3xl font-semibold">$12,480</p>
      </GlassCard>
    </Backdrop>
  )
}
