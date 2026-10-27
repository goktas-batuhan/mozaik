import { Bell, GitCommitHorizontal, MessageSquare, Rocket, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { AnimatedList, type AnimatedListProps } from './animated-list'

const events: { icon: ReactNode; title: string; body: string; time: string }[] = [
  { icon: <Rocket />, title: 'Deployed to production', body: 'mozaik-site, 14 seconds ago', time: '14s' },
  { icon: <Star />, title: 'New star', body: 'Someone liked your registry', time: '1m' },
  { icon: <MessageSquare />, title: 'New comment', body: 'The easing on the dock feels great', time: '3m' },
  { icon: <GitCommitHorizontal />, title: 'Commit pushed', body: 'Tighten the marquee loop', time: '8m' },
  { icon: <Bell />, title: 'Build finished', body: 'All checks passed', time: '12m' },
]

function Events(props: Omit<AnimatedListProps, 'children'>) {
  return (
    <div className="h-[22rem] w-[min(26rem,90vw)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
      <AnimatedList {...props}>
        {events.map((e) => (
          <div
            key={e.title}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-card-foreground"
          >
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary [&>svg]:size-5"
            >
              {e.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{e.title}</p>
              <p className="truncate text-xs text-muted-foreground">{e.body}</p>
            </div>
            <span className="text-xs text-muted-foreground">{e.time}</span>
          </div>
        ))}
      </AnimatedList>
    </div>
  )
}

export default function AnimatedListDemo() {
  return <Events interval={1.1} loop />
}

export function VariantPreview(props: Omit<AnimatedListProps, 'children'>) {
  return <Events {...props} />
}
