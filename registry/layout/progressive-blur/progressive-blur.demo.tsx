import { ProgressiveBlur } from './progressive-blur'

const rows = [
  'Install the registry',
  'Pick a component',
  'Copy the source',
  'Tune the props',
  'Check reduced motion',
  'Ship it',
  'Write the changelog',
  'Tag a release',
  'Open the docs',
  'Share the demo',
]

export default function ProgressiveBlurDemo() {
  return (
    <div className="relative h-[22rem] w-[min(24rem,90vw)] overflow-hidden rounded-2xl border border-border bg-background">
      <div className="h-full overflow-y-auto p-4" tabIndex={0} role="region" aria-label="Scrollable list">
        <ul className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <li
              key={r}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-card-foreground"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-sm font-medium text-primary">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{r}</span>
            </li>
          ))}
        </ul>
      </div>
      <ProgressiveBlur position="both" height="5rem" />
    </div>
  )
}
