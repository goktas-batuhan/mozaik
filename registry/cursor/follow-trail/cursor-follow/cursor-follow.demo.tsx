import { CursorFollow, type CursorFollowProps } from './cursor-follow'

const items = [
  { title: 'Projects', label: 'Open', body: 'Everything that shipped this year.' },
  { title: 'Writing', label: 'Read', body: 'Notes on motion and interface craft.' },
  { title: 'Contact', label: 'Say hi', body: 'A short message is all it takes.' },
]

export default function CursorFollowDemo() {
  return <Area />
}

function Area(props: Omit<CursorFollowProps, 'children'>) {
  return (
    <CursorFollow
      className="grid h-[320px] w-[min(48rem,calc(100vw-4rem))] grid-cols-1 gap-3 rounded-2xl border bg-card p-6 sm:grid-cols-3"
      {...props}
    >
      {items.map((item) => (
        <div key={item.title} data-cursor-text={item.label} className="rounded-xl border bg-background p-5">
          <h3 className="text-sm font-medium">{item.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </CursorFollow>
  )
}

export function VariantPreview(props: Omit<CursorFollowProps, 'children'>) {
  return <Area {...props} />
}
