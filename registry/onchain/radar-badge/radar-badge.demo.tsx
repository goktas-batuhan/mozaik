import { BellRing, Check } from 'lucide-react'
import { useState } from 'react'
import { RadarBadge, type RadarStatus } from './radar-badge'

interface Watcher {
  name: string
  detail: string
  status: RadarStatus
  label?: string
}

const WATCHERS: Watcher[] = [
  { name: 'Whale wallets', detail: '42 addresses · mainnet', status: 'live' },
  { name: 'Bridge contracts', detail: 'Base, Arbitrum, Optimism', status: 'scanning', label: 'Scanning' },
  { name: 'Airdrop claims', detail: 'Paused since Monday', status: 'idle', label: 'Paused' },
]

export default function RadarBadgeDemo() {
  const [signals, setSignals] = useState(0)

  const treasury: Watcher =
    signals > 0
      ? { name: 'Treasury multisig', detail: 'Unusual outflow detected', status: 'alert', label: `${signals} signal${signals > 1 ? 's' : ''}` }
      : { name: 'Treasury multisig', detail: '3 of 5 signers · Safe', status: 'live' }

  const button =
    'inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

  return (
    <div className="w-[min(92vw,560px)] space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <RadarBadge status="live" />
        <RadarBadge status="scanning" />
        <RadarBadge status="alert" label="3 signals" />
        <RadarBadge status="idle" />
      </div>

      <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <span className="text-sm font-medium">Watchers</span>
          <RadarBadge size="sm" status={signals > 0 ? 'alert' : 'live'} label={signals > 0 ? 'Attention' : 'All clear'} />
        </div>
        <ul className="divide-y">
          {[treasury, ...WATCHERS].map((w) => (
            <li key={w.name} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{w.name}</p>
                <p className="truncate text-xs text-muted-foreground">{w.detail}</p>
              </div>
              <RadarBadge size="sm" status={w.status} label={w.label} />
            </li>
          ))}
        </ul>
        <div className="flex gap-2 border-t px-5 py-3">
          <button type="button" className={button} onClick={() => setSignals((s) => s + 1)}>
            <BellRing aria-hidden className="size-3.5" />
            Simulate signal
          </button>
          <button type="button" className={button} disabled={signals === 0} onClick={() => setSignals(0)}>
            <Check aria-hidden className="size-3.5" />
            Resolve
          </button>
        </div>
      </div>
    </div>
  )
}
