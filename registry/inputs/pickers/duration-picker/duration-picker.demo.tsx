import { useState } from 'react'
import { DurationPicker, formatDuration } from './duration-picker'

export default function DurationPickerDemo() {
  const [seconds, setSeconds] = useState(5400)
  return (
    <div className="flex flex-col items-center gap-6">
      <DurationPicker label="Session length" value={seconds} onChange={setSeconds} />
      <p className="text-sm text-muted-foreground tabular-nums">
        Selected: <span className="text-foreground">{formatDuration(seconds)}</span> ({seconds}s)
      </p>
      <DurationPicker label="Timer (minutes and seconds)" units={['minutes', 'seconds']} defaultValue={90} max={3599} />
    </div>
  )
}
