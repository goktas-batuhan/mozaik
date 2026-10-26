import { useState } from 'react'
import { AnimatedSubscribeButton } from './animated-subscribe-button'

const Check = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7" />
  </svg>
)

export default function AnimatedSubscribeButtonDemo() {
  const [on, setOn] = useState(true)

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatedSubscribeButton>
        <span>Subscribe</span>
        <span className="flex items-center gap-2">
          <Check /> Subscribed
        </span>
      </AnimatedSubscribeButton>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-card-foreground">
        <span aria-hidden className="grid size-9 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          MZ
        </span>
        <div className="mr-2">
          <p className="text-sm font-medium">Mozaik Weekly</p>
          <p className="text-xs text-muted-foreground">{on ? 'You get the newsletter' : 'Not subscribed'}</p>
        </div>
        <AnimatedSubscribeButton subscribed={on} onSubscribedChange={setOn} className="h-9 px-4 text-sm">
          <span>Follow</span>
          <span>Following</span>
        </AnimatedSubscribeButton>
      </div>
    </div>
  )
}
