import { StatsProgressBars } from './stats-progress-bars'

export default function StatsProgressBarsDemo() {
  return (
    <div className="w-full max-w-5xl">
      <StatsProgressBars
        title="Quality we measure, and publish"
        description="Every release is checked against the same targets. These are the latest results."
        stats={[
          { label: 'Test coverage', value: 94, description: 'Unit and end-to-end tests across all packages' },
          { label: 'Accessibility audit', value: 100, description: 'No open issues from automated checks' },
          { label: 'Zero-dependency parts', value: 72, description: 'Pieces that need nothing beyond React' },
          { label: 'Customer renewals', value: 91, description: 'Teams that stayed after their first year' },
        ]}
      />
    </div>
  )
}
