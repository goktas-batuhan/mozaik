import { FeaturesTabs } from './features-tabs'

function Panel({ rows }: { rows: number[] }) {
  return (
    <div aria-hidden className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        <span className="size-2 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="space-y-3 p-4">
        {rows.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`size-6 shrink-0 rounded-md ${i === 0 ? 'bg-primary' : 'bg-muted'}`} />
            <span style={{ width: `${w}%` }} className="h-2.5 rounded-full bg-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeaturesTabsDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FeaturesTabs
        title="Built for the way teams work"
        description="Pick a workflow to see how it fits."
        tabs={[
          {
            id: 'plan',
            label: 'Plan',
            title: 'Plan the week in minutes',
            description: 'Drag work into a calm timeline and see conflicts before they happen.',
            points: ['Shared roadmaps', 'Capacity at a glance', 'Dependencies that stay in sync'],
            visual: <Panel rows={[80, 62, 71, 48]} />,
          },
          {
            id: 'build',
            label: 'Build',
            title: 'Ship without the hand-offs',
            description: 'Specs, code and reviews live side by side, so nothing gets lost in translation.',
            points: ['Inline review threads', 'Preview links for every change', 'One-click rollbacks'],
            visual: <Panel rows={[55, 84, 66, 74]} />,
          },
          {
            id: 'learn',
            label: 'Learn',
            title: 'Know what worked',
            description: 'Dashboards turn every release into a lesson for the next one.',
            points: ['Release health', 'Weekly digests', 'Exportable reports'],
            visual: <Panel rows={[68, 44, 90, 58]} />,
          },
        ]}
      />
    </div>
  )
}
