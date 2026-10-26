import { Marquee } from './marquee'

const quotes = [
  ['Ship it', 'The detail is in the easing.'],
  ['Quiet motion', 'Nothing moves without a reason.'],
  ['Tokens first', 'One palette, every component.'],
  ['Copy and own', 'Installed straight into your repo.'],
  ['Accessible', 'Reduced motion is a first-class state.'],
  ['Tiny API', 'Duration, delay, className. That is it.'],
]

function Card({ title, body }: { title: string; body: string }) {
  return (
    <figure className="w-60 shrink-0 rounded-xl border border-border bg-card p-4 text-card-foreground">
      <figcaption className="text-sm font-medium">{title}</figcaption>
      <blockquote className="mt-1 text-sm text-muted-foreground">{body}</blockquote>
    </figure>
  )
}

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-[min(52rem,90vw)] flex-col gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <Marquee pauseOnHover duration={36} repeat={3}>
        {quotes.map(([t, b]) => (
          <Card key={t} title={t} body={b} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover duration={44} repeat={3}>
        {[...quotes].reverse().map(([t, b]) => (
          <Card key={t} title={t} body={b} />
        ))}
      </Marquee>
    </div>
  )
}
