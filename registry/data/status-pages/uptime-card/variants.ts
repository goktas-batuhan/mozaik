import type { DayStatus, UptimeCardProps } from './uptime-card'

const days = (n: number, marks: Record<number, DayStatus> = {}): DayStatus[] =>
  Array.from({ length: n }, (_, i) => marks[i] ?? 'up')

// A variant is the same component with a named prop set. Copy the component, then use these props.
export const variants: { name: string; title: string; description: string; props: UptimeCardProps }[] = [
  {
    name: 'two-weeks',
    title: 'Two weeks',
    description: 'Fourteen wide bars per service for a short, readable window.',
    props: {
      title: 'Last 14 days',
      endDate: '2026-10-14',
      services: [
        { name: 'API', history: days(14, { 6: 'degraded' }), incidents: [{ day: 6, title: 'Elevated error rates on writes', minutes: 18 }] },
        { name: 'Dashboard', history: days(14) },
      ],
    },
  },
  {
    name: 'ninety-days',
    title: 'Ninety days',
    description: 'A dense strip of ninety thin bars for a long history.',
    props: {
      title: 'Last 90 days',
      endDate: '2026-10-14',
      services: [
        {
          name: 'API',
          history: days(90, { 14: 'degraded', 41: 'down', 77: 'degraded' }),
          incidents: [
            { day: 14, title: 'Slow responses in eu-west', minutes: 23 },
            { day: 41, title: 'Database failover', minutes: 52 },
            { day: 77, title: 'Elevated error rates on writes', minutes: 18 },
          ],
        },
      ],
    },
  },
]
