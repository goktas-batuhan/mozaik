import { HeroEmailWaitlist } from './hero-email-waitlist'

export default function HeroEmailWaitlistDemo() {
  return (
    <div className="w-full max-w-4xl">
      <HeroEmailWaitlist
        eyebrow="Early access"
        title="A calmer inbox is coming"
        description="Join the waitlist and be first to try the mail client that sorts the noise for you."
        footnote="2,400 people are already waiting."
      />
    </div>
  )
}
