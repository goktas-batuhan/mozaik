import { CtaMarqueeBand } from './cta-marquee-band'

export default function CtaMarqueeBandDemo() {
  return (
    <div className="w-full max-w-5xl">
      <CtaMarqueeBand
        phrases={['Design that ships', 'Motion with meaning', 'Built to be owned']}
        title="Your next project deserves a good start."
        actionLabel="Let's talk"
        actionHref="#"
      />
    </div>
  )
}
