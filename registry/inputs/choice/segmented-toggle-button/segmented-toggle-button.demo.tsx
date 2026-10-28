import { useState } from 'react'
import { SegmentedToggleButton } from './segmented-toggle-button'

const RANGES = ['Day', 'Week', 'Month'] as const

export default function SegmentedToggleButtonDemo() {
  const [range, setRange] = useState(1)
  return (
    <div className="flex flex-col items-center gap-6">
      <SegmentedToggleButton aria-label="Calendar range" options={RANGES} value={range} onChange={setRange} />
      <p className="text-sm text-muted-foreground">
        Showing the <span className="text-foreground">{RANGES[range].toLowerCase()}</span> view
      </p>
      <SegmentedToggleButton aria-label="Plan" options={['Free', 'Pro', 'Team', 'Enterprise']} defaultValue={1} />
    </div>
  )
}
