import { StatusDot } from './status-dot'

const SERVICES = [
  { name: 'API', status: 'online' },
  { name: 'Indexer', status: 'degraded' },
  { name: 'Webhooks', status: 'maintenance' },
  { name: 'Legacy RPC', status: 'offline' },
] as const

export default function StatusDotDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-3">
        <StatusDot status="online" />
        <StatusDot status="degraded" />
        <StatusDot status="maintenance" />
        <StatusDot status="offline" />
      </div>
      <ul className="w-[min(92vw,320px)] divide-y rounded-xl border bg-card text-sm text-card-foreground">
        {SERVICES.map((service) => (
          <li key={service.name} className="flex items-center justify-between px-4 py-2.5">
            <span className="font-medium">{service.name}</span>
            <StatusDot status={service.status} />
          </li>
        ))}
      </ul>
    </div>
  )
}
