import { DirectionAwareTabs } from './direction-aware-tabs'

const Panel = ({ title, body, tiles }: { title: string; body: string; tiles: number }) => (
  <div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    <p className="mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
    <div className="mt-4 flex gap-2">
      {Array.from({ length: tiles }, (_, i) => (
        <div key={i} className="h-16 flex-1 rounded-lg bg-linear-to-br from-primary/30 to-muted" />
      ))}
    </div>
  </div>
)

export default function DirectionAwareTabsDemo() {
  return (
    <div className="w-[480px] max-w-full">
      <DirectionAwareTabs
        tabs={[
          { id: 'overview', label: 'Overview', content: <Panel title="Overview" body="A short summary. Move to a tab on the right and the panel slides in from the right." tiles={2} /> },
          { id: 'activity', label: 'Activity', content: <Panel title="Activity" body="This panel is taller. The container animates its height instead of jumping." tiles={4} /> },
          { id: 'settings', label: 'Settings', content: <Panel title="Settings" body="Go back left and the motion reverses. Arrow keys, Home and End work too." tiles={1} /> },
        ]}
      />
    </div>
  )
}
