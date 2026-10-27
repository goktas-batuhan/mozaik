import { SmoothCursor, type SmoothCursorProps } from './smooth-cursor'

const cards = [
  { title: 'Calm', body: 'The pointer glides instead of snapping.' },
  { title: 'Aware', body: 'It turns toward the way you are moving.' },
  { title: 'Scoped', body: 'The system cursor returns outside this area.' },
]

export default function SmoothCursorDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Move inside the box</p>
        <h2 className="text-3xl font-semibold tracking-tight">A cursor with some weight</h2>
      </div>
      <SmoothCursor className="grid grid-cols-1 gap-3 overflow-hidden rounded-2xl border bg-card p-6 sm:grid-cols-3">
        {cards.map(({ title, body }) => (
          <div key={title} className="rounded-xl border bg-background p-5">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{body}</p>
          </div>
        ))}
      </SmoothCursor>
    </div>
  )
}

export function VariantPreview(props: Omit<SmoothCursorProps, 'children' | 'cursor'>) {
  return (
    <SmoothCursor
      className="grid w-[min(48rem,90vw)] grid-cols-1 gap-3 overflow-hidden rounded-2xl border bg-card p-6 sm:grid-cols-3"
      {...props}
    >
      {cards.map(({ title, body }) => (
        <div key={title} className="rounded-xl border bg-background p-5">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{body}</p>
        </div>
      ))}
    </SmoothCursor>
  )
}
