import { CtaBeamCard } from './cta-beam-card'

export default function CtaBeamCardDemo() {
  return (
    <div className="w-full max-w-3xl">
      <CtaBeamCard
        title="Make your next launch feel effortless"
        description="Everything you need to go from idea to a live page this afternoon."
        perks={['No credit card', 'Cancel any time', 'Free templates']}
        actionLabel="Start your free trial"
        actionHref="#"
        note="14 days, full access."
      />
    </div>
  )
}
