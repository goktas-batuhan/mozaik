import { StatsBand } from './stats-band'

export default function StatsBandDemo() {
  return (
    <div className="w-full max-w-5xl">
      <StatsBand
        title="Mozaik in numbers"
        stats={[
          { value: 120, suffix: '+', label: 'Components' },
          { value: 48, suffix: 'K', label: 'Weekly installs' },
          { value: 99.9, suffix: '%', decimalPlaces: 1, label: 'Typed coverage' },
          { value: 4, label: 'Years in the making' },
        ]}
      />
    </div>
  )
}
