import { Sparkline } from './sparkline'

const SIGNUPS = [12, 14, 13, 18, 17, 22, 21, 27, 25, 31, 36, 34]
const ERRORS = [9, 8, 11, 7, 6, 8, 5, 4, 5, 3, 4, 2]

export default function SparklineDemo() {
  return (
    <div className="flex w-[min(92vw,360px)] flex-col gap-4">
      {[
        { name: 'Signups', data: SIGNUPS, tone: 'success' as const, smooth: true, area: true },
        { name: 'Errors', data: ERRORS, tone: 'destructive' as const, smooth: false, area: false },
        { name: 'Latency', data: [40, 42, 39, 41, 40, 43, 41], tone: 'muted' as const, smooth: false, area: false },
      ].map((row) => (
        <div key={row.name} className="flex h-10 items-center justify-between gap-4 border-b border-border text-sm text-foreground">
          <span>{row.name}</span>
          <Sparkline data={row.data} tone={row.tone} smooth={row.smooth} area={row.area} label={row.name} />
        </div>
      ))}
    </div>
  )
}
