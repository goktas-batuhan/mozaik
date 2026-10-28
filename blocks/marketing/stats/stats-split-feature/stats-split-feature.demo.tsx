import { StatsSplitFeature } from './stats-split-feature'

export default function StatsSplitFeatureDemo() {
  return (
    <div className="w-full max-w-5xl">
      <StatsSplitFeature
        eyebrow="Trusted at scale"
        title="Built for teams that ship every day"
        description="From two-person studios to global companies, teams rely on us to keep their work moving."
        action={{ label: 'Read the customer stories', href: '#' }}
        stats={[
          { value: 8, suffix: 'K', label: 'Teams', description: 'Across 60 countries' },
          { value: 1.2, suffix: 'B', decimalPlaces: 1, label: 'Events a month', description: 'Processed without a hiccup' },
          { value: 45, suffix: ' ms', label: 'Median latency', description: 'Measured at the edge' },
          { value: 4.9, suffix: '/5', decimalPlaces: 1, label: 'Customer rating', description: 'From 3,200 reviews' },
        ]}
      />
    </div>
  )
}
