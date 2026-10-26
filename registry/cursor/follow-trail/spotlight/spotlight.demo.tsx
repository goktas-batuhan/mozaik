import { Command, Cpu, Gauge, Layers, ShieldCheck, Zap } from 'lucide-react'
import { Spotlight } from './spotlight'

const features = [
  { Icon: Zap, title: 'Instant', body: 'Under 50 ms from keypress to paint.' },
  { Icon: Layers, title: 'Composable', body: 'Small pieces that stack cleanly.' },
  { Icon: ShieldCheck, title: 'Accessible', body: 'Keyboard first, screen reader tested.' },
  { Icon: Command, title: 'Shortcuts', body: 'Every action one chord away.' },
  { Icon: Gauge, title: 'Measured', body: 'Budgets enforced on every build.' },
  { Icon: Cpu, title: 'Lightweight', body: 'No runtime beyond React and Motion.' },
]

export default function SpotlightDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Move across the grid</p>
        <h2 className="text-3xl font-semibold tracking-tight">Built for the details</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {features.map(({ Icon, title, body }) => (
          <Spotlight key={title} className="rounded-xl border bg-card p-5">
            <Icon className="size-5 text-primary" aria-hidden />
            <h3 className="mt-6 text-sm font-medium text-card-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{body}</p>
          </Spotlight>
        ))}
      </div>
    </div>
  )
}
