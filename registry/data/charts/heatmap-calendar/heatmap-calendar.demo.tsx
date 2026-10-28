import { useState } from 'react'
import { HeatmapCalendar } from './heatmap-calendar'

// Fixed pseudo-activity: same picture on every render.
const VALUES = Array.from({ length: 20 * 7 }, (_, i) => {
  const wave = Math.sin(i * 0.9) + Math.cos(i * 0.31)
  return Math.max(0, Math.round((wave + 1.2) * 3 * (i % 7 === 0 || i % 7 === 6 ? 0.3 : 1)))
})

export default function HeatmapCalendarDemo() {
  const [picked, setPicked] = useState<string>('')

  return (
    <div className="flex w-[min(92vw,420px)] flex-col gap-3">
      <HeatmapCalendar values={VALUES} unit="commits" label="Commits" onSelect={(i, v) => setPicked(`Day ${i + 1}: ${v} commits`)} />
      <p className="h-5 text-sm text-muted-foreground" aria-live="polite">
        {picked || 'Pick a day.'}
      </p>
    </div>
  )
}
