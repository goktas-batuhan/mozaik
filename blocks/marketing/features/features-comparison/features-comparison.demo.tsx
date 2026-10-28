import { FeaturesComparison } from './features-comparison'

export default function FeaturesComparisonDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FeaturesComparison
        title="See how Mozaik compares"
        description="Copy-paste components, without the lock-in."
        columns={[
          { id: 'mozaik', name: 'Mozaik', caption: 'Free, MIT', highlight: true },
          { id: 'kit', name: 'UI kit', caption: 'Paid license' },
          { id: 'diy', name: 'Build it yourself', caption: 'Your time' },
        ]}
        rows={[
          { feature: 'You own the source', values: { mozaik: true, kit: false, diy: true } },
          { feature: 'Reduced motion built in', hint: 'Calm, static fallback', values: { mozaik: true, kit: false, diy: false } },
          { feature: 'Install with one command', values: { mozaik: true, kit: true, diy: false } },
          { feature: 'Design tokens', values: { mozaik: 'shadcn variables', kit: 'Custom theme', diy: 'Your choice' } },
          { feature: 'Time to first section', values: { mozaik: '5 minutes', kit: '1 hour', diy: '1 week' } },
        ]}
      />
    </div>
  )
}
