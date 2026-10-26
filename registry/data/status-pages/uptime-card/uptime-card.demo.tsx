import { UptimeCard, type DayStatus, type UptimeService } from './uptime-card'

const DAYS = 45

/** A history of `up` days with a few marked ones. */
function history(marks: Record<number, DayStatus>, missing = 0): DayStatus[] {
  return Array.from({ length: DAYS }, (_, i) => (i < missing ? 'none' : (marks[i] ?? 'up')))
}

const SERVICES: UptimeService[] = [
  {
    name: 'API',
    history: history({ 12: 'degraded', 31: 'degraded' }),
    incidents: [
      { day: 12, title: 'Elevated error rates on writes', minutes: 18 },
      { day: 31, title: 'Slow responses in eu-west', minutes: 23 },
    ],
  },
  {
    name: 'Webhooks',
    history: history({ 27: 'down', 44: 'degraded' }),
    incidents: [
      { day: 27, title: 'Deliveries delayed', minutes: 48 },
      { day: 44, title: 'Retries backing up', minutes: 11 },
    ],
  },
  {
    name: 'Database',
    history: history({ 20: 'down' }, 6),
    incidents: [{ day: 20, title: 'Failover to replica', minutes: 9 }],
  },
]

export default function UptimeCardDemo() {
  return <UptimeCard services={SERVICES} endDate="2026-10-14" className="w-[min(92vw,560px)]" />
}
