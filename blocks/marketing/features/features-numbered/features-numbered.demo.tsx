import { FeaturesNumbered } from './features-numbered'

export default function FeaturesNumberedDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FeaturesNumbered
        eyebrow="Our approach"
        title="Four ideas, applied everywhere"
        description="We keep the product small on purpose. These principles decide what makes the cut."
        features={[
          { title: 'Clarity first', description: 'If it needs a manual, we redesign it.' },
          { title: 'Calm by default', description: 'Motion and sound are opt-in, never a surprise.' },
          { title: 'Own your data', description: 'Export everything, any time, in open formats.' },
          { title: 'Built to last', description: 'Boring technology and a long-term roadmap.' },
        ]}
      />
    </div>
  )
}
