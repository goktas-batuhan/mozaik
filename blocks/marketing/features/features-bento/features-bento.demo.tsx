// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/features/features-2/index.tsx
import type { ReactNode } from 'react'
import { FeaturesBento } from './features-bento'

const Icon = ({ d }: { d: string }): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const BARS = [38, 52, 44, 66, 58, 74, 62, 88, 71, 96, 84, 100]

function AnalyticsVisual() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-semibold tabular-nums text-foreground">$48,219</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">+12.4%</span>
      </div>
      <div className="flex min-h-0 flex-1 items-end gap-1.5">
        {BARS.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-sm ${i === BARS.length - 1 ? 'bg-primary' : 'bg-primary/20'}`} />
        ))}
      </div>
    </div>
  )
}

const Dots = () => (
  <div className="grid h-full grid-cols-6 content-center gap-2 p-5">
    {Array.from({ length: 18 }, (_, i) => (
      <span key={i} className={`aspect-square rounded-full ${i % 5 === 0 ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
    ))}
  </div>
)

const Lines = () => (
  <div className="space-y-2.5 p-5">
    {[78, 56, 90, 42].map((w, i) => (
      <span key={i} style={{ width: `${w}%` }} className="block h-2 rounded-full bg-muted-foreground/20" />
    ))}
  </div>
)

export default function FeaturesBentoDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesBento
        eyebrow="Platform"
        title="One workspace, every part of the product"
        description="From first idea to production traffic, each piece is designed to fit the others."
        features={[
          { title: 'Smart analytics', description: 'Real-time metrics with charts you can actually read.', icon: <Icon d="M4 20V10m6 10V4m6 16v-7m4 7H2" />, visual: <AnalyticsVisual />, colSpan: 2, rowSpan: 2 },
          { title: 'Team collaboration', description: 'Comment, share and review in the same place.', icon: <Icon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />, visual: <Dots /> },
          { title: 'API first', description: 'A documented REST API and typed SDKs.', icon: <Icon d="m8 6-6 6 6 6m8-12 6 6-6 6" />, visual: <Lines /> },
          { title: 'Global delivery', description: 'Served from the edge location nearest to each visitor.', icon: <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" /> },
          { title: 'Secure by default', description: 'Encryption at rest and in transit, audit logs included.', icon: <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, colSpan: 2 },
        ]}
      />
    </div>
  )
}
