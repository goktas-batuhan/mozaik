import { NumberTicker } from './number-ticker'

const stats = [
  { value: 120, suffix: '+', label: 'Components' },
  { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
  { value: 48210, suffix: '', label: 'Installs' },
]

export default function NumberTickerDemo() {
  return (
    <div className="grid w-[min(48rem,90vw)] grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card">
      {stats.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center gap-1 px-4 py-10">
          <p className="text-4xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
            <NumberTicker value={s.value} decimalPlaces={s.decimals ?? 0} delay={i * 0.15} />
            <span className="text-primary">{s.suffix}</span>
          </p>
          <p className="text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
